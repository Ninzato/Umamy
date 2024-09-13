"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.UserProfile, { onDelete: "CASCADE" });
      User.hasMany(models.UserCourse, { onDelete: "CASCADE" });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Email cannot be empty!",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Password cannot be empty!",
          },
          isStrongPassword() {
            const passwordPattern =
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordPattern.test(this.password)) {
              throw new Error(
                `Your password is too weak! You're not worthy of this website`,
              );
            }
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "Role cannot be empty",
          },
        },
      },
    },
    {
      hooks: {
        beforeCreate: (user) => {
          const salt = bcrypt.genSaltSync(8);
          const hash = bcrypt.hashSync(user.password, salt);

          user.password = hash;
        },
      },
      sequelize,
      modelName: "User",
    },
  );
  return User;
};
