const SitemapGenerator = require('sitemap-generator');

// Create generator
const generator = SitemapGenerator('https://omar-afifi.com', {
  filepath: './public/sitemap.xml', // Path to save the sitemap
  maxDepth: 0
});

// Register event listeners
generator.on('done', () => {
  console.log('Sitemap generated');
});

// Start the crawler
generator.start();
