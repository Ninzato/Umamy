const { User } = require("../models");

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
    try {
      res.send("signinfomr");
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }

  static async signInPost(req, res) {
    const { email, password } = req.body;
    try {
      res.send(req.body);
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }
}

module.exports = RidzaController;
