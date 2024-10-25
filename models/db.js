const dbConfig = require("./config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Alumni = require("./alumni")(sequelize, Sequelize);
db.Verification = require("./verification")(sequelize, Sequelize);

module.exports = db;
