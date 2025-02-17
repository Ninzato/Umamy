"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsTo(models.Category);
      Course.hasMany(models.UserCourse);
    }
  }
  Course.init(
    {
      title: DataTypes.STRING,
      author: DataTypes.STRING,
      duration: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      rating: DataTypes.INTEGER,
      CategoryId: DataTypes.INTEGER,
      imageUrl: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "Course",
    },
  );
  return Course;
};
