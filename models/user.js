"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    fbid: DataTypes.BIGINT,
    name: DataTypes.STRING,
    ownerOrLover: DataTypes.BOOLEAN,
    favoriteBreed: DataTypes.STRING,
    contactEmail: DataTypes.STRING,
    contactNumber: DataTypes.BIGINT,
    about: DataTypes.STRING,
    streetAddress: DataTypes.STRING,
    zipCode: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Dog);
      }
    }
  });

  return User;
};
