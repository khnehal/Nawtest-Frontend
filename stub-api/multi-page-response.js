const randomString = require("randomstring");

const createResponse = (data, hasMoreElements) => ({
  ...data,
  metaDatal: {
    hasMoreElements: hasMoreElements,
    ...(hasMoreElements && { nextPageIndex: randomString.generate(8) }),
  },
});

function multiPageResponse(entities) {
  const perPage = 50;
  const pages = Math.ceil(entities.length / perPage);
  let page = 0;
  return (req, res) => {
    if (req.url.toLowerCase().includes("pageindex")) {
      page++;
    } else {
      page = 0;
    }
    const hasMoreElements = page < pages - 1;

    res.json(
      createResponse(
        { results: entities.slice(page * perPage, page * perPage + perPage) },
        hasMoreElements
      )
    );
  };
}

module.exports = multiPageResponse;
