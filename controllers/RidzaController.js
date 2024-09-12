const { User, UserCourse, Course, UserProfile } = require("../models");
const bcrypt = require("bcryptjs");
const { Op, where } = require("sequelize");
const Controller = require("./Controller.js");

class RidzaController {
  static async signUpForm(req, res) {
    const { errors } = req.query;
    try {
      res.render("SignUpForm", { errors });
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }

  static async signUpPost(req, res) {
    const { email, password, role } = req.body;
    try {
      //   let firstName = (lastName = bio = "");
      await User.create({ email, password, role });
      //   await UserProfile.create;
      await Controller.sendWelcomeEmail(email);
      res.redirect("/signIn");
    } catch (err) {
      if (err.name === "SequelizeValidationError") {
        const errors = err.errors.map((el) => el.message);
        return res.redirect(`/signUp?errors=${errors}`);
      }
      console.log(err);
      res.send(err.message);
    }
  }

  static async signInForm(req, res) {
    const { errors } = req.query;
    try {
      res.render("SignInForm", { errors });
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }

  static async signInPost(req, res) {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({
        where: {
          email: email,
        },
      });

      if (user) {
        const isValidPassword = bcrypt.compareSync(password, user.password);

        if (isValidPassword) {
          req.session.userId = user.id;
          return res.redirect(`/`);
        } else {
          const errors = ["Wrong password! Try again"];
          return res.redirect(`/signIn?errors=${errors}`);
        }
      }
      res.send(req.body);
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }

  static async userProfileForm(req, res) {
    const { id } = req.params;
    try {
      const userProfile = await UserProfile.findOne({
        where: {
          id: id,
        },
      });
      res.render("userProfileForm", { userProfile });
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }

  static async userProfilePost(req, res) {
    const { firstName, lastName, bio } = req.body;
    const { id } = req.params;
    try {
      const userProfile = await UserProfile.findOne({
        where: {
          id: id,
        },
      });
      userProfile.update(
        {
          firstName,
          lastName,
          bio,
        },
        {
          where: {
            id: id,
          },
        },
      );
      res.redirect(`/userProfile/${id}`);
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }

  static async userCourses(req, res) {
    const { status } = req.query;
    try {
      const options = {
        where: {
          id: 2,
        },
        include: {
          model: UserCourse,
          include: Course,
        },
      };

      if (status) {
        options.include.where = {
          status: {
            [Op.iLike]: `%${status}%`,
          },
        };
      }
      const userData = await User.findOne(options);
      //   res.send(userData);
      res.render("userCourses", { userData });
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }

  static async makeComplete(req, res) {
    const { id } = req.params;
    try {
      const userCourse = await UserCourse.findOne({
        where: {
          id: id,
        },
      });
      userCourse.makeComplete();
      res.redirect("/userCourses");
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }
}

module.exports = RidzaController;
