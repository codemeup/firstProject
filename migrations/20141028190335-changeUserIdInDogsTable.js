"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    migration.renameColumn("Dogs", "userId", "UserId").complete(done);
  },

  down: function(migration, DataTypes, done) {
    migration.renameColumn("Dogs", "UserId", "userId").complete(done);    
  }
};
