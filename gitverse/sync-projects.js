const https = require('https');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN_GITVERSE || process.env.GITHUB_TOKEN;
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID; // Optional

if (!GITHUB_TOKEN || !VERCEL_TOKEN) {
  console.error('Error: GITHUB_TOKEN and VERCEL_TOKEN environment variables are required.');
  process.exit(1);
}

function request(url, options) {
  return new Promise((resolve, reject) => {
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function getGithubRepos() {
  const options = {
    headers: {
      'User-Agent': 'Gitverse-Sync',
      'Authorization': `token ${GITHUB_TOKEN}`
    }
  };
  return request('https://api.github.com/user/repos?per_page=100', options);
}

async function getVercelProjects() {
  const teamParam = VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : '';
  const options = {
    headers: {
      'Authorization': `Bearer ${VERCEL_TOKEN}`
    }
  };
  const data = await request(`https://api.vercel.com/v9/projects${teamParam}`, options);
  return data.projects || [];
}

async function sync() {
  console.log('🚀 Starting Gitverse Sync...');
  
  try {
    const [ghRepos, vercelProjects] = await Promise.all([
      getGithubRepos(),
      getVercelProjects()
    ]);

    if (!Array.isArray(ghRepos)) {
      console.error('Failed to fetch GitHub repos. Check your token.');
      return;
    }

    const vercelProjectNames = new Set(vercelProjects.map(p => p.name.toLowerCase()));
    const vercelRepoIds = new Set(vercelProjects.filter(p => p.link).map(p => p.link.repoId.toString()));

    console.log(`Found ${ghRepos.length} GitHub repositories.`);
    console.log(`Found ${vercelProjects.length} Vercel projects.`);
    console.log('\n--- Orphan Repositories (Not on Vercel) ---');

    const orphans = ghRepos.filter(repo => {
      const isDeployedByName = vercelProjectNames.has(repo.name.toLowerCase());
      const isDeployedById = vercelRepoIds.has(repo.id.toString());
      return !isDeployedByName && !isDeployedById;
    });

    if (orphans.length === 0) {
      console.log('✅ All GitHub repositories are already deployed on Vercel!');
    } else {
      orphans.forEach(repo => {
        console.log(`- ${repo.full_name} (${repo.html_url})`);
      });
      console.log(`\nTotal Orphans: ${orphans.length}`);
      console.log('\nTo deploy an orphan, run: vercel link --repo [repo-url]');
    }

  } catch (error) {
    console.error('Sync failed:', error.message);
  }
}

sync();
