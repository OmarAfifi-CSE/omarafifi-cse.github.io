module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "public": "." });

  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("CNAME");

  return {
    dir: {
      input: "views",
      includes: "partials",
      output: "_site"
    }
  };
};