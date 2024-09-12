const { Op } = require("sequelize");
const { Course } = require("../models");

class Controller {
  static async home(req,res){
    const {search} = req.query;
    try {
      const opt = {
        order: [
          ['rating','DESC']
        ],
        limit: 6
      };

      if(search){
        delete opt.order;
        delete opt.limit;
        opt.where.title = {
          [Op.iLike] : '%search%'
        }
      }
        const courses = await Course.findAll(opt);
        console.log(courses);
        // res.send(courses);
        res.render("Home",{courses});
    } catch (err){
        console.log(err.message);
        res.send(err.message);
    }
  }

  static async showCoursesByCategory(req,res){
    const{ categoryId } = req.params;
    const { search } = req.query;
    try{
      const opt = {
        where:{CategoryId:categoryId},
      };
      if(search){
        opt.where.title = {
          [Op.iLike] : `%${search}%`
        }
      }
      const courses = await Course.findAll(opt);
      console.log(courses);
      res.render("Home",{courses})
    } catch (err){
      console.log(err.message);
      res.render(err.message);
    }
  }
}

module.exports = Controller;
