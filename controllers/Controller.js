const { Op } = require("sequelize");
const { Course, User } = require("../models");

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
  //TODO: masih belum ada association ya
  static async adminShowsUsers(req, res) {
    try {
      let users = await User.findAll({
        include: {
          model: UserCourse,
          include: Course,
        },
        include: UserProfile,
      });
      res.send(users);
      // res.render("AdminUsersTable", {users});
    } catch (err) {
      console.log(err.message);
      res.send(err.message);
    }
  }
}

module.exports = Controller;
