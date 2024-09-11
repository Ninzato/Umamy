class Controller {
  static async home(req, res) {
    try {
      res.send("home");
    } catch (err) {
      console.log(err);
      res.send(err.message);
    }
  }
}

module.exports = Controller;
