const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  {
    // MySQL username,
    user: "root",
    // MySQL password
    password: "rootroot",
    database: "employee_managment_db",
  },
  {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
  }
);

module.exports = sequelize;
