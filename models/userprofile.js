"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async getProfile(id) {
      const data = await this.findOne({
        where: {
          UserId: id,
        },
      });
      return data;
    }

    static associate(models) {
      // define association here
      UserProfile.belongsTo(models.User, { onDelete: "CASCADE" });
    }
  }
  UserProfile.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      bio: DataTypes.TEXT,
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserProfile",
    },
  );
  return UserProfile;
};
