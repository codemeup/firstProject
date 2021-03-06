"use strict";

module.exports = function(sequelize, DataTypes) {
  var Dog = sequelize.define("Dog", {
    name: DataTypes.STRING,
    breed: DataTypes.STRING,
    age: DataTypes.INTEGER,
    about: DataTypes.STRING,
    walkiesNeeds: DataTypes.STRING,
    guiltyPleasure: DataTypes.STRING,
    pictureUrl: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Dog.belongsTo(models.User);
        Dog.hasMany(models.User, {as: "Favorite"});
      }
    }
  });

  return Dog;
};
