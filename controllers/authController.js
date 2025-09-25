const accountController = {};

/***** Build the login view ******/
accountController.buildLoginView = async function (req, res) {
   res.render("./login");
};

accountController.buildDashboardView = async function (req, res) {
   res.render("./dashboard", {
      title: "Dashboard",
      user: req.user,
   });
};

accountController.buildManagementView = async function (req, res) {
   res.render("./management", {
      title: "Management",
      user: req.user,
   });
};

accountController.logout = function (req, res, next) {
   req.logout(function (err) {
      if (err) {
         return next(err);
      }
      req.session.destroy(() => {
         res.redirect("/");
      });
   });
};

module.exports = accountController;
