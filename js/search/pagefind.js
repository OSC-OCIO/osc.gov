let pagefindPromise;

function waitForSitePagefind() {
  if (window.sitePagefind) {
    return Promise.resolve(window.sitePagefind);
  }

  return new Promise(function (resolve) {
    window.addEventListener(
      "sitePagefindReady",
      function () {
        resolve(window.sitePagefind);
      },
      { once: true },
    );
  });
}

async function loadPagefind() {
  if (!pagefindPromise) {
    pagefindPromise = (async function () {
      const pagefind = await waitForSitePagefind();
      const basePath = window.sitePagefindBasePath || "/pagefind/";
      await pagefind.options({ basePath });
      return pagefind;
    })();
  }

  return pagefindPromise;
}

module.exports = {
  loadPagefind,
};
