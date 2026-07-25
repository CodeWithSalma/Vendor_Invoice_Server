// const serverless = require("serverless-http");

// const app = require("../app");

// module.exports = serverless(app);


// module.exports = (req, res) => {
//   res.json({ ok: true, msg: "bare handler works" });
// };

const app = require("../app");

module.exports = (req, res) => {
  res.json({ ok: true, msg: "app loaded", routes: app._router?.stack?.length });
};