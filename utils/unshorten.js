const axios = require("axios");
const https = require("https");

module.exports = async function unshorten(url) {
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });
  axios
    .get(url)
    .then((res) => {
      if (!res) return null;
      if (res.status == 301) {
        return unshorten(response.redirect_destination);
      } else if (res.status == 200) {
        return res.request.res.responseUrl;
      } else if (res.status == 404) {
        console.error("Error unshorten util");
      } else if (res.status == 499) {
        return res.request.res.responseUrl;
      } else {
        console.debug(res.status);
        return;
      }
    })
    .catch((err) => {
      console.error(err);
      return null;
      // console.log(e.request.res.responseUrl)
      // return e.request.res.responseUrl
      // console.log(e.request._options.href)
      // return e.request._options.href
    });
};
