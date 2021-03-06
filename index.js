const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");

require("console.table");

init();

// Display logo text, load main prompts
function init() {
  const logoText = logo({ name: "Employee Manager" }).render();

  console.log(logoText);

  loadMainPrompts();
}

function loadMainPrompts() {
  prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        {
          name: "View All Employees",
          value: "VIEW_EMPLOYEES",
        },
        {
          name: "Add Employee",
          value: "ADD_EMPLOYEE",
        },
        {
          name: "Update Employee Role",
          value: "UPDATE_EMPLOYEE_ROLE",
        },
        {
          name: "Update Employee Manager",
          value: "UPDATE_EMPLOYEE_MANAGER",
        },
        {
          name: "View All Roles",
          value: "VIEW_ROLES",
        },
        {
          name: "Add Role",
          value: "ADD_ROLE",
        },
        {
          name: "View All Departments",
          value: "VIEW_DEPARTMENTS",
        },
        {
          name: "Add Department",
          value: "ADD_DEPARTMENT",
        },
        {
          name: "Quit",
          value: "QUIT",
        },
      ],
    },
  ]).then((res) => {
    let choice = res.choice;
    // call the function that the user chose
    switch (choice) {
      case "VIEW_EMPLOYEES":
        viewEmployees(); //Done
        break;
      case "ADD_EMPLOYEE":
        addEmployee(); // Done
        break;
      case "UPDATE_EMPLOYEE_ROLE":
        updateEmployeeRole(); //Done
        break;
      case "UPDATE_EMPLOYEE_MANAGER":
        updateEmployeeManager(); // Done
        break;
      case "VIEW_ROLES":
        viewRoles(); // Done
        break;
      case "ADD_ROLE":
        addRole(); // Done
        break;
      case "VIEW_DEPARTMENTS":
        viewDepartments(); // Done
        break;
      case "ADD_DEPARTMENT":
        addDepartment(); //Done
        break;
      case "QUIT":
        quit();
        break;
    }

    // view all employees
    function viewEmployees() {
      db.findAllEmployees()
        .then(([rows]) => {
          let employees = rows;
          console.log("\n");
          console.table(employees);
        })
        .then(() => loadMainPrompts());
    }

    // add an employee
    function addEmployee() {
      db.findAllRoles().then(([rows]) => {
        let roles = rows;
        const roleChoices = roles.map(({ id, title }) => ({
          name: title,
          value: id,
        }));
        prompt([
          {
            type: "input",
            name: "first_name",
            message: "What is the employee's first name?",
          },
          {
            type: "input",
            name: "last_name",
            message: "What is the employee's last name?",
          },
          {
            type: "list",
            name: "role_id",
            message: "What is the employee's role?",
            choices: roleChoices,
          },
        ]).then((res) => {
          let employeeFirstName = res.first_name;
          let employeeLastName = res.last_name;
          let employeeRoleId = res.role_id;
          db.findAllEmployees().then(([rows]) => {
            let employees = rows;
            const managerChoices = employees.map(
              ({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id,
              })
            );
            prompt([
              {
                type: "list",
                name: "managerId",
                message:
                  "Which manager do you want to assign the selected employee?",
                choices: managerChoices,
              },
            ])
              .then((res) =>
                db.createEmployee(
                  {
                    first_name: employeeFirstName,
                    last_name: employeeLastName,
                    role_id: employeeRoleId,
                    manager_id: res.managerId,
                  }
                )
              )
              .then(() => console.log("Added employee to the database"))
              .then(() => loadMainPrompts());
          });
        });
      });
    }

    // update the employees role
    function updateEmployeeRole() {
      db.findAllEmployees().then(([rows]) => {
        let employees = rows;
        const employeeChoices = employees.map(
          ({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id,
          })
        );

        prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Which employee's role do you want to update?",
            choices: employeeChoices,
          },
        ]).then((res) => {
          let employeeId = res.employeeId;
          db.findAllRoles().then(([rows]) => {
            let roles = rows;
            const roleChoices = roles.map(({ id, title }) => ({
              name: title,
              value: id,
            }));

            prompt([
              {
                type: "list",
                name: "roleId",
                message:
                  "Which role do you want to assign the selected employee?",
                choices: roleChoices,
              },
            ])
              .then((res) => db.updateEmployeeRole(employeeId, res.roleId))
              .then(() => console.log("Updated employee's role?"))
              .then(() => loadMainPrompts());
          });
        });
      });
    }

    // updates employees manager
    function updateEmployeeManager() {
      db.findAllEmployees().then(([rows]) => {
        let employees = rows;
        const employeeChoices = employees.map(
          ({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id,
          })
        );

        prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Which employee's manager do you want to update?",
            choices: employeeChoices,
          },
        ]).then((res) => {
          let employeeId = res.employeeId;
          db.findAllPossibleManagers(employeeId).then(([rows]) => {
            let employees = rows;
            const managerChoices = employees.map(
              ({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id,
              })
            );

            prompt([
              {
                type: "list",
                name: "managerId",
                message: "Which manager do you want to assign the selected employee?",
                choices: managerChoices,
              },
            ])
              .then((res) =>
                db.updateEmployeeManager(employeeId, res.managerId)
              )
              .then(() => console.log("updated employee's manager"))
              .then(() => loadMainPrompts());
          });
        });
      });
    }

    // shows all the roles in table form in the console
    function viewRoles() {
      db.findAllRoles()
        .then(([rows]) => {
          let roles = rows;
          console.log("\n");
          console.table(roles);
        })
        .then(() => loadMainPrompts());
    }

    // adds a role to the db
    function addRole() {
      db.findAllDepartments().then(([rows]) => {
        let departments = rows;
        const departmentChoices = departments.map(({ id, name }) => ({
          name: name,
          value: id,
        }));

        prompt([
          {
            type: "input",
            name: "title",
            message: "What is the name of the role?",
          },
          {
            type: "input",
            name: "salary",
            message: "What is the salary of the role?",
          },
          {
            type: "list",
            name: "department_id",
            message: "Which department does the role belong to?",
            choices: departmentChoices,
          },
        ])
          .then((res) =>
            db.createRole(res)
          )
          .then(() => console.log("Added role to the database"))
          .then(() => loadMainPrompts());
      });
    }

    // shows all departments in table form in the console
    function viewDepartments() {
      db.findAllDepartments()
        .then(([rows]) => {
          let departments = rows;
          console.log("\n");
          console.table(departments);
        })
        .then(() => loadMainPrompts());
    }

    // adds a department to the db
    function addDepartment() {
      prompt([
        {
          type: "input",
          name: "name",
          message: "What is the name of the department?",
        },
      ])
        .then((res) => db.createDepartment(res))
        .then(() => console.log("Added department to the database"))
        .then(() => loadMainPrompts());
    }

    function quit() {
      const logoText = logo({ name: "SQL Employee Manager, GoodBye!" }).render();
      console.log(logoText);
      process.exit();
    }
  });
}