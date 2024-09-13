"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserCourse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    async makeComplete() {
      await this.update(
        {
          status: "completed",
        },
        {
          where: {
            id: this.id,
          },
        },
      );
    }

    static associate(models) {
      // define association here
      UserCourse.belongsTo(models.User, { onDelete: "CASCADE" });
      UserCourse.belongsTo(models.Course);
    }
  }
  UserCourse.init(
    {
      status: DataTypes.STRING,
      purchaseDate: DataTypes.DATEONLY,
      CourseId: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
    },
    {
      hooks: {
        beforeCreate: (userCourse) => {
          let theDate = new Date();
          userCourse.purchaseDate = theDate.toISOString();
        },
      },
      sequelize,
      modelName: "UserCourse",
    },
  );
  return UserCourse;
};
