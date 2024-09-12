const { Op } = require("sequelize");
const { Course, User, UserCourse, UserProfile } = require("../models");
const nodeMailer = require("nodemailer");
const roundRating = require("../helpers/roundRating.js");
require("dotenv").config();

class Controller {
  static async sendWelcomeEmail(userEmail) {
    try {
      const transporter = nodeMailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const info = await transporter.sendMail({
        from: `UMAMY <${process.env.EMAIL_USER}>`,
        to: `${userEmail}`,
        subject: "Welcome to UMAMY!",
        html: `<h1>Hello welcome to UMAMY! Hopefully you'll enjoy learning here!</h1>`,
      });
      // console.log(info);
    } catch (err) {
      console.log(err.message);
    }
  }

  static async sendCongratulationsEmail(userEmail) {
    try {
      const transporter = nodeMailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const info = await transporter.sendMail({
        from: `UMAMY <${process.env.EMAIL_USER}>`,
        to: `${userEmail}`,
        subject: "Congratulations on completing the course!",
        html: `<h1>Hope you'll excel with your new skill and knowledge!</h1>
            <h2>Will definitely wait for you to enroll our other interesting courses soon!</h2>`,
      });
      // console.log(info);
    } catch (err) {
      console.log(err.message);
    }
  }
  static async home(req, res) {
    const { search, id } = req.query;
    try {
      const isSignedIn = !!req.session.userId;
      // console.log(isSignedIn);

      const opt = {
        order: [["rating", "DESC"]],
        limit: 6,
        where: {},
      };

      let courses = await Course.findAll(opt);

      if (search) {
        delete opt.order;
        delete opt.limit;
        opt.where = {
          title: {
            [Op.iLike]: `%${search}%`,
          },
        };
        courses = await Course.findAll(opt);
      }

      let userCourses;
      let takenCourses = [];
      if (id) {
        userCourses = await UserCourse.findAll({
          where: {
            UserId: id,
          },
        });

        userCourses.forEach((el) => {
          takenCourses.push(el.CourseId);
        });

        opt.where = {
          id: {
            [Op.notIn]: takenCourses,
          },
        };
        courses = await Course.findAll(opt);
      }

      if (search && id) {
        delete opt.order;
        delete opt.limit;
        opt.where = {
          title: {
            [Op.iLike]: `%${search}%`,
          },
          id: {
            [Op.notIn]: takenCourses,
          },
        };
        courses = await Course.findAll(opt);
      }

      // console.log(courses);
      // res.send(courses);

      res.render("Home", { courses, isSignedIn, id, roundRating });
    } catch (err) {
      console.log(err.message);
      res.send(err.message);
    }
  }

  static async showCoursesByCategory(req, res) {
    const { categoryId } = req.params;
    const { search, id } = req.query;
    try {
      const isSignedIn = !!req.session.userId;

      const opt = {
        order: [["rating", "DESC"]],
        limit: 6,
        where: {
          CategoryId: categoryId,
        },
      };

      let courses = await Course.findAll(opt);

      let userCourses;
      let takenCourses = [];
      if (id) {
        userCourses = await UserCourse.findAll({
          where: {
            UserId: id,
          },
        });

        userCourses.forEach((el) => {
          takenCourses.push(el.CourseId);
        });

        opt.where = {
          CategoryId: categoryId,
          id: {
            [Op.notIn]: takenCourses,
          },
        };
        courses = await Course.findAll(opt);
      }
      // console.log(courses);
      res.render("Home", { courses, isSignedIn, id, roundRating });
    } catch (err) {
      console.log(err.message);
      res.render(err.message);
    }
  }

  static async enrollToCourse(req, res) {
    const { status, CourseId, UserId } = req.query;
    try {
      // res.send(req.query);
      await UserCourse.create({ status, CourseId, UserId });
      res.redirect(`/userCourses/${UserId}?id=${UserId}`);
    } catch (err) {
      console.log(err);
      res.send(err.message);
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
      // console.log([deletedCourse.title, deletedCourse.author]);
      res.redirect(
        `/admin?deletedCourse=${deletedCourse.title},${deletedCourse.author}`,
      );
    } catch (err) {
      console.log(err.message);
      res.send(err.message);
    }
  }

  static async adminShowsUsers(req, res) {
    let { deletedUser } = req.query;
    try {
      let users = await User.findAll({
        include: [
          {
            model: UserProfile,
          },
          {
            model: UserCourse,
            include: [Course],
          },
        ],
      });
      // res.send(users);
      // console.log(users);
      res.render("AdminUsersTable", { users, deletedUser });
    } catch (err) {
      console.log(err.message);
      res.send(err.message);
    }
  }

  static async adminDeleteUser(req, res) {
    const { userId } = req.params;
    try {
      const deletedUser = await User.findByPk(userId);
      await User.destroy({ where: { id: userId } });
      res.redirect(
        `/admin/users?deletedUser=${deletedUser.UserProfile ? deletedUser.UserProfile.firstName : "undefined"},${deletedUser.UserProfile ? deletedUser.UserProfile.firstName : "undefined"}`,
      );
    } catch (err) {
      console.log(err.message);
      res.send(err.message);
    }
  }
}

module.exports = Controller;
