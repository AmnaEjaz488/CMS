import inquirer from 'inquirer';
import pkg from 'pg';
import consoleTable from 'console.table';

const { Client } = pkg;

// Database connection
const db = new Client({
  user: 'postgres', // Replace with your PostgreSQL username
  host: 'localhost',
  database: 'cms_db', // Replace with your database name
  password: 'password', // Replace with your PostgreSQL password
  port: 5432,
});

db.connect();

// Function to view all departments
function viewAllDepartments() {
  db.query('SELECT id AS Department_ID, name AS Department_Name FROM department', (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    mainMenu(); // Return to the main menu
  });
}

// Function to view all roles
function viewAllRoles() {
  db.query(
    `SELECT 
      role.id AS Role_ID, 
      role.title AS Job_Title, 
      department.name AS Department, 
      role.salary AS Salary
    FROM role
    JOIN department ON role.department_id = department.id`,
    (err, res) => {
      if (err) throw err;
      console.table(res.rows);
      mainMenu(); // Return to the main menu
    }
  );
}

// Function to view all employees
function viewAllEmployees() {
  db.query(
    `SELECT 
      e.id AS Employee_ID, 
      e.first_name AS First_Name, 
      e.last_name AS Last_Name, 
      role.title AS Job_Title, 
      department.name AS Department, 
      role.salary AS Salary, 
      CONCAT(m.first_name, ' ', m.last_name) AS Manager
    FROM employee e
    LEFT JOIN role ON e.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee m ON e.manager_id = m.id`,
    (err, res) => {
      if (err) throw err;
      console.table(res.rows);
      mainMenu(); // Return to the main menu
    }
  );
}

// Function to add a department
function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'department_name',
        message: 'Enter the name of the department:',
      },
    ])
    .then((answer) => {
      db.query('INSERT INTO department (name) VALUES ($1)', [answer.department_name], (err) => {
        if (err) throw err;
        console.log('Department added successfully!');
        mainMenu();
      });
    });
}

// Function to add a role
function addRole() {
  db.query('SELECT id, name FROM department', (err, res) => {
    if (err) throw err;
    const departments = res.rows.map((dept) => ({ name: dept.name, value: dept.id }));

    inquirer
      .prompt([
        {
          type: 'input',
          name: 'role_name',
          message: 'Enter the name of the role:',
        },
        {
          type: 'input',
          name: 'salary',
          message: 'Enter the salary for the role:',
        },
        {
          type: 'list',
          name: 'department_id',
          message: 'Select the department for the role:',
          choices: departments,
        },
      ])
      .then((answers) => {
        db.query(
          'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',
          [answers.role_name, answers.salary, answers.department_id],
          (err) => {
            if (err) throw err;
            console.log('Role added successfully!');
            mainMenu();
          }
        );
      });
  });
}

// Function to add an employee
function addEmployee() {
  db.query('SELECT id, title FROM role', (err, roleRes) => {
    if (err) throw err;
    const roles = roleRes.rows.map((role) => ({ name: role.title, value: role.id }));

    db.query('SELECT id, first_name, last_name FROM employee', (err, empRes) => {
      if (err) throw err;
      const managers = empRes.rows.map((emp) => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id,
      }));
      managers.unshift({ name: 'None', value: null });

      inquirer
        .prompt([
          {
            type: 'input',
            name: 'first_name',
            message: "Enter the employee's first name:",
          },
          {
            type: 'input',
            name: 'last_name',
            message: "Enter the employee's last name:",
          },
          {
            type: 'list',
            name: 'role_id',
            message: "Select the employee's role:",
            choices: roles,
          },
          {
            type: 'list',
            name: 'manager_id',
            message: "Select the employee's manager:",
            choices: managers,
          },
        ])
        .then((answers) => {
          db.query(
            'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
            [answers.first_name, answers.last_name, answers.role_id, answers.manager_id],
            (err) => {
              if (err) throw err;
              console.log('Employee added successfully!');
              mainMenu();
            }
          );
        });
    });
  });
}

// Function to update an employee's role
function updateEmployeeRole() {
  db.query('SELECT id, first_name, last_name FROM employee', (err, empRes) => {
    if (err) throw err;
    const employees = empRes.rows.map((emp) => ({
      name: `${emp.first_name} ${emp.last_name}`,
      value: emp.id,
    }));

    db.query('SELECT id, title FROM role', (err, roleRes) => {
      if (err) throw err;
      const roles = roleRes.rows.map((role) => ({ name: role.title, value: role.id }));

      inquirer
        .prompt([
          {
            type: 'list',
            name: 'employee_id',
            message: 'Select the employee to update:',
            choices: employees,
          },
          {
            type: 'list',
            name: 'role_id',
            message: 'Select the new role:',
            choices: roles,
          },
        ])
        .then((answers) => {
          db.query(
            'UPDATE employee SET role_id = $1 WHERE id = $2',
            [answers.role_id, answers.employee_id],
            (err) => {
              if (err) throw err;
              console.log('Employee role updated successfully!');
              mainMenu();
            }
          );
        });
    });
  });
}

// Main menu
function mainMenu() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View All Departments',
          'View All Roles',
          'View All Employees',
          'Add a Department',
          'Add a Role',
          'Add an Employee',
          'Update an Employee Role',
          'Exit',
        ],
      },
    ])
    .then((answer) => {
      switch (answer.action) {
        case 'View All Departments':
          viewAllDepartments();
          break;
        case 'View All Roles':
          viewAllRoles();
          break;
        case 'View All Employees':
          viewAllEmployees();
          break;
        case 'Add a Department':
          addDepartment();
          break;
        case 'Add a Role':
          addRole();
          break;
        case 'Add an Employee':
          addEmployee();
          break;
        case 'Update an Employee Role':
          updateEmployeeRole();
          break;
        case 'Exit':
          db.end();
          break;
      }
    });
}

// Start the application
mainMenu();