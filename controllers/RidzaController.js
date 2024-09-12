const { User, UserCourse, Course, UserProfile } = require("../models");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
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
      const firstName = "";
      const lastName = "";
      const bio = "";
      const userId = await User.create({ email, password, role });
      await UserProfile.create({ firstName, lastName, bio, UserId: userId.id });
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
          if (user.role === "Admin") {
            req.session.admin = user.role;
            return res.redirect(`/admin`);
          } else {
            return res.redirect(`/?id=${user.id}`);
          }
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
      const isSignedIn = !!req.session.userId;
      const userProfile = await UserProfile.getProfile(id);
      res.render("userProfileForm", { userProfile, isSignedIn, id });
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
          UserId: id,
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
            UserId: id,
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
    const { status, id } = req.query;
    try {
      const isSignedIn = !!req.session.userId;

      const options = {
        where: {
          id: id,  
        },
        include: [
          {
            model: UserCourse,
            include: [Course], 
          },
        ],
      };
      let userData = await User.findOne(options);

      if (status) {
        options.include = {
          model: UserCourse,
          where: {
            status: {
              [Op.iLike]: `%${status}%`,
            },
          },
          include: Course,
        };

        userData = await User.findOne(options);
      }
      //   res.send(userData);
      res.render("userCourses", { userData, isSignedIn, id });
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
      await userCourse.makeComplete();
      res.redirect(`/userCourses/${userCourse.UserId}?id=${userCourse.UserId}`);
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }

  static async signOut(req, res) {
    try {
      req.session.destroy();
      res.redirect("/");
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }
}

module.exports = RidzaController;
