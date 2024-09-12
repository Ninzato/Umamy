const { Op } = require("sequelize");
const { Course, User, UserCourse, UserProfile } = require("../models");

class Controller {
  static async home(req, res) {
    const { search } = req.query;
    try {
      const opt = {
        order: [["rating", "DESC"]],
        limit: 6,
      };

      if (search) {
        delete opt.order;
        delete opt.limit;
        opt.where.title = {
          [Op.iLike]: "%search%",
        };
      }
      const courses = await Course.findAll(opt);
      console.log(courses);
      // res.send(courses);
      res.render("Home", { courses });
    } catch (err) {
      console.log(err.message);
      res.send(err.message);
    }
  }

  static async showCoursesByCategory(req, res) {
    const { categoryId } = req.params;
    const { search } = req.query;
    try {
      const opt = {
        where: { CategoryId: categoryId },
      };
      if (search) {
        opt.where.title = {
          [Op.iLike]: `%${search}%`,
        };
      }
      const courses = await Course.findAll(opt);
      console.log(courses);
      res.render("Home", { courses });
    } catch (err) {
      console.log(err.message);
      res.render(err.message);
    }
  }

  static async showAdminTable(req, res) {
    let { deletedCourse } = req.query;
    if (deletedCourse != undefined) deletedCourse = deletedCourse.split(",");
    try {
      let courses = await Course.findAll();
      res.render("AdminTable", { courses, deletedCourse });
    } catch (err) {
      console.log(err.message);
      res.send(err.message);
    }
  }

  static async adminDeleteCourse(req, res) {
    const { id } = req.params;
    try {
      const deletedCourse = await Course.findByPk(id);
      await Course.destroy({ where: { id } });
      console.log([deletedCourse.title, deletedCourse.author]);
      res.redirect(
        `/admin?deletedCourse=${deletedCourse.title},${deletedCourse.author}`,
      );
    } catch (err) {
      console.log(err.message);
      res.send(err.message);
    }
  }

  static async adminShowsUsers(req, res) {
    let {deletedUser} = req.query;
    try {
      let users = await User.findAll({
        include: [
          {
            model: UserProfile, 
          },
          {
            model: UserCourse,
            include: [Course] 
          }
        ]
      });
      // res.send(users);
      console.log(users.UserProfile);
      res.render("AdminUsersTable", {users, deletedUser});
    } catch (err) {
      console.log(err.message);
      res.send(err.message);
    }
  }

  static async adminDeleteUser(req,res){
    const { userId } = req.params;
    try{
      const deletedUser = await User.findByPk(userId);
      await User.destroy({where:{id:userId}});
      res.redirect(
        `/admin/users?deletedUser=${deletedUser.UserProfile ? deletedUser.UserProfile.firstName : 'undefined'},${deletedUser.UserProfile ? deletedUser.UserProfile.firstName : 'undefined'}`,
      );
    } catch (err){
      console.log(err.message);
      res.send(err.message);
    }
  }
}

module.exports = Controller;
