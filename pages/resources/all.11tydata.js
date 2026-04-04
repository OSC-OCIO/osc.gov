module.exports = {
  eleventyComputed: {
    items: (data) => [
      {
        links: Array.isArray(data.paged_resources) ? data.paged_resources : [],
      },
    ],
  },
};
