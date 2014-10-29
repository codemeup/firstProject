"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Dogs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      },
      breed: {
        type: DataTypes.STRING
      },
      age: {
        type: DataTypes.INTEGER
      },
      about: {
        type: DataTypes.STRING
      },
      walkiesNeeds: {
        type: DataTypes.STRING
      },
      guiltyPleasure: {
        type: DataTypes.STRING
      },
      userId: {
        type: DataTypes.INTEGER,
        foreignKey:true
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
    migration.dropTable("Dogs").done(done);
  }
};