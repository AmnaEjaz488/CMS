SELECT 
    e.id AS id, 
    e.first_name, 
    e.last_name, 
    role.title AS title, 
    department.name AS department, 
    role.salary, 
    CASE 
        WHEN m.first_name IS NULL THEN 'NULL'
        ELSE CONCAT(m.first_name, ' ', m.last_name)
    END AS manager
FROM employee e
LEFT JOIN role ON e.role_id = role.id
LEFT JOIN department ON role.department_id = department.id
LEFT JOIN employee m ON e.manager_id = m.id
ORDER BY e.id;