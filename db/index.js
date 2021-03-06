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
  };

  // Find all employees except the given employee id
  findAllPossibleManagers(employeeId) {
    return this.connection
      .promise()
      .query(
        "SELECT id, first_name, last_name FROM employee WHERE id != ?",
        employeeId,
      );
  };

  // Create a new employee
  createEmployee(employee) {
    return this.connection
      .promise()
      .query("INSERT INTO employee SET ?", employee);
  };

  // Update thte given employee's role
  updateEmployeeRole(employeeId, roleId) {
    return this.connection
      .promise()
      .query("UPDATE employee SET role_id = ? WHERE id = ?", [
        roleId,
        employeeId,
      ]);
  };

  // Update the given employee's manager
  updateEmployeeManager(id, manager_id) {
    return this.connection
      .promise()
      .query("UPDATE employee SET manager_id = ? WHERE id = ?", [
        manager_id,
        id,
      ]);
  };

  // Update the given employee's department
  updateEmployeeDepartment(employeeId, departmentId) {
    return this.connection
      .promise()
      .query("UPDATE employee SET department_id = ? WHERE id = ?", [
        departmentId,
        employeeId,
      ]);
  };

  // Find all roles, join with departments to display the department name
  findAllRoles() {
    return this.connection
      .promise()
      .query(
        "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
      );
  };

  // create a new role
  createRole(role) {
    return this.connection
    .promise()
    .query("INSERT INTO role SET ?", role);
  };

  // remove a role from the db
  removeRole(roleId) {
    return this.connection
      .promise()
      .query("DELETE FROM role WHERE id = ?", roleId);
  };

  // find all departments
  findAllDepartments() {
    return this.connection
      .promise()
      .query("SELECT department.id, department.name FROM department;");
  };

  // create a new department
  createDepartment(department) {
    console.log(department);
    return this.connection
      .promise()
      .query("INSERT INTO department SET ?", department);
  };

  // remove a department from the db
  removeDepartment(departmentId) {
    return this.connection
      .promise()
      .query("DELETE FROM role WHERE id = ?", departmentId);
  };
}

module.exports = new DB(connection);
