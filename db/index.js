const { resolve } = require("path/posix");
const connection = require("./connection");

class DB {
  // Keep reference to the connection on the class in case we need it
  constructor(connection) {
    this.connection = connection;
  }

  // Find all employees, join with roles and departments in order to display their roles, saleries, departments, and managers
  findAllEmployees() {
    return this.connection
      .promise()
      .query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
      );
  }
  // Find all employees except the given employee id
  findAllPossibleManagers(employeeId) {
    return this.connection
      .promise()
      .query(
        "SELECT id, first_name, last_name FROM employee WHERE id != ?",
        employeeId
      );
  }

  // Create a new employee
  createEmployee(employee) {
    return this.connection
      .promise()
      .query("INSERT INTO employee SET ?", employee);
  }

  // Remove an employee with the id from the user
  removeEmployee(employeeId) {
    return this.connection
      .promise()
      .query("DELETE FROM employee WHERE id = ?", employeeId);
  }
}
