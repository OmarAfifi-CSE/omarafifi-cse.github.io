module.exports = async function () {
    // Only include repos hosted directly under omar-afifi.com/<repo>/
    const repos = ['daphq'];
    const results = {};

    await Promise.all(repos.map(async (repo) => {
        try {
            const response = await fetch(`https://api.github.com/repos/OmarAfifi-CSE/${repo}`, {
                headers: {
                    'User-Agent': 'OmarAfifi-Portfolio-Builder'
                }
            });

            if (!response.ok) {
                throw new Error(`GitHub API response was not ok for ${repo}`);
            }

            const data = await response.json();
            results[repo] = {
                lastmod: data.pushed_at
            };
        } catch (error) {
            console.error(`Failed to fetch ${repo} GitHub data, using fallback date:`, error);
            results[repo] = {
                lastmod: new Date().toISOString()
            };
        }
    }));

    return results;
};
