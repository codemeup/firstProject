"use strict";

module.exports = function(sequelize, DataTypes) {
  var DogsUsers = sequelize.define("DogsUsers", {
    DogId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return DogsUsers;
};