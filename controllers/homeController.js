const homeController = {};
homeController.buildHomeView = async function (req, res) {
   res.render("./index", {
      title: "Home",
   });
};

module.exports = homeController;
