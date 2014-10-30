"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      fbid: {
        type: DataTypes.BIGINT
      },
      name: {
        type: DataTypes.STRING
      },
      ownerOrLover: {
        type: DataTypes.BOOLEAN
      },
      favoriteBreed: {
        type: DataTypes.STRING
      },
      contactEmail: {
        type: DataTypes.STRING
      },
      contactNumber: {
        type: DataTypes.BIGINT
      },
      about: {
        type: DataTypes.STRING
      },
      streetAddress: {
        type: DataTypes.STRING
      },
      zipCode: {
        type: DataTypes.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("Users").done(done);
  }
};