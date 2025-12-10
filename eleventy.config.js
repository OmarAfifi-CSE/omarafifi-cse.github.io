module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "public": "." });

  return {
    dir: {
      input: "views",
      includes: "partials",
      output: "_site"
    }
  };
};