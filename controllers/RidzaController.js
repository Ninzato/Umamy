const { User } = require("../models");
const bcrypt = require("bcryptjs");

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
      await User.create({ email, password, role });
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
          return res.send("Masukkk");
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
}

module.exports = RidzaController;
