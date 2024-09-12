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












//Search Courses by Category
router.get("/category/:categoryId", Controller.showCoursesByCategory);
router.get("/admin", Controller.showAdminTable);
router.get("/admin/courses/:id/delete", Controller.adminDeleteCourse);
router.get("/admin/users", Controller.adminShowsUsers);

module.exports = router;
