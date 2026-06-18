module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "public": "." });
  eleventyConfig.addPassthroughCopy({ "node_modules/swiper/swiper-bundle.min.css": "styles/swiper-bundle.min.css" });
  eleventyConfig.addPassthroughCopy({ "node_modules/swiper/swiper-bundle.min.js": "js/swiper-bundle.min.js" });

  return {
    dir: {
      input: "views",
      includes: "_templates",
      output: "_site"
    }
  };
};