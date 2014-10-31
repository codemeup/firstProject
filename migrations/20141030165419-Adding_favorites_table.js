"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("DogsUsers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      DogId: {
        type: DataTypes.INTEGER,
        references: "Dogs",
        referencesKey: "id"
      },
      UserId: {
        type: DataTypes.INTEGER,
        references: "Users",
        referencesKey: "id"
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
    migration.dropTable("DogsUsers").done(done);
  }
};