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
// router.use((req, res, next) => {
//   if (!req.session.userId) {
//     res.redirect("/signIn?errors=Please login first!"); //kalau user id gada di session, tendang balik ke login page
//   } else {
//     next(); //udah login? monggo lanjut
//   }
// });

// UserProfile
router.get("/userProfile/:id", RidzaController.userProfileForm);
router.post("/userProfile/:id", RidzaController.userProfilePost);

// UserCourses
router.get("/userCourses", RidzaController.userCourses);
router.get("/userCourses/:id/makeComplete", RidzaController.makeComplete);

//Search Courses by Category
router.get("/category/:categoryId", Controller.showCoursesByCategory);
router.get("/admin", Controller.showAdminTable);
router.get("/admin/courses/:id/delete", Controller.adminDeleteCourse);
router.get("/admin/users", Controller.adminShowsUsers);
module.exports = router;
