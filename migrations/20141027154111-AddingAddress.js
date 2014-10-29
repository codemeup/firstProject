"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.addColumn("Users", "streetAddress", DataTypes.STRING);
    migration.addColumn("Users", "zipCode", DataTypes.INTEGER);
    done();
  },

  down: function(migration, DataTypes, done) {
    migration.removeColumn("Users", "streetAddress");
    migration.removeColumn("Users", "zipCode");
    done();
  }
};
