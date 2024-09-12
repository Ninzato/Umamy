const Controller = require("../controllers/Controller");
const RidzaController = require("../controllers/RidzaController");

const router = require("express").Router();

router.get("/", Controller.home);

//Sign Up
router.get("/signUp", RidzaController.signUpForm);
router.post("/signUp", RidzaController.signUpPost);

// Sign In
router.get("/signIn", RidzaController.signInForm);
router.post("/signIn", RidzaController.signInPost);

// Middleware
router.use((req, res, next) => {
  if (!req.session.userId) {
    res.redirect("/signIn?errors=Please login first!"); //kalau user id gada di session, tendang balik ke login page
  } else {
    next(); //udah login? monggo lanjut
  }
});

const isAdmin = (req, res, next) => {
  if (!req.session.admin) {
    res.send(`FATAL ERROR! YOU'RE NOT ADMIN!!`);
  } else {
    next();
  }
};

// UserProfile
router.get("/userProfile/:id", RidzaController.userProfileForm);
router.post("/userProfile/:id", RidzaController.userProfilePost);

// UserCourses
router.get("/userCourses/:id", RidzaController.userCourses);
router.get("/userCourses/:id/makeComplete", RidzaController.makeComplete);

// Enrolling
router.get("/enroll/:courseId", Controller.enrollToCourse);

//Search Courses by Category
router.get("/category/:categoryId", Controller.showCoursesByCategory);
router.get("/admin", isAdmin, Controller.showAdminTable);
router.get("/admin/courses/:id/delete", isAdmin, Controller.adminDeleteCourse);
router.get("/admin/users", isAdmin, Controller.adminShowsUsers);
router.get("/admin/users/:userId/delete", isAdmin, Controller.adminDeleteUser);
module.exports = router;

// Sign Out
router.get("/signOut", RidzaController.signOut);
