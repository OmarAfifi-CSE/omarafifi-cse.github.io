module.exports = async function () {
    try {
        const response = await fetch('https://api.github.com/repos/OmarAfifi-CSE/daphq');

        if (!response.ok) {
            throw new Error('GitHub API response was not ok');
        }

        const data = await response.json();

        return {
            lastmod: data.pushed_at
        };
    } catch (error) {
        console.error('Failed to fetch Daphq GitHub data, using fallback date:', error);
        return {
            lastmod: new Date().toISOString()
        };
    }
};