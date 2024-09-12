const { Course } = require("../models");

class Controller {
  static async home(req,res){
    const {search} = req.query;
    try {
        const courses = await Course.findAll();
        res.render("Home",{courses});
    } catch (err){
        console.log(err.message);
        res.send(err.message);
    }
}
}

module.exports = Controller;
