-- Query to view all departments
SELECT id AS Department_ID, name AS Department_Name FROM department;

-- Query to view all roles
SELECT 
    role.id AS Role_ID, 
    role.title AS Job_Title, 
    department.name AS Department, 
    role.salary AS Salary
FROM role
JOIN department ON role.department_id = department.id;

-- Query to view all employees
SELECT 
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
LEFT JOIN employee m ON e.manager_id = m.id;




SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;




