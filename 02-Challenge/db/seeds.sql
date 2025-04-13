-- Insert data into department table
INSERT INTO department (id, name)
VALUES 
    (1, 'Sales'),
    (2, 'Engineering'),
    (3, 'Finance'),
    (4, 'Legal');

-- Insert data into role table
INSERT INTO role (id, title, salary, department_id)
VALUES 
    (1, 'Sales Manager', 75000, 1),
    (2, 'Software Engineer', 90000, 2),
    (3, 'Legal Advisor', 80000, 4),
    (4, 'Account Manager', 125000, 3),
    (5, 'Accountant', 60000, 3);

-- Insert data into employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('John', 'Doe', 1, NULL), -- Sales Manager, no manager
    ('Jane', 'Smith', 2, 1), -- Software Engineer, reports to John
    ('Alice', 'Johnson', 5, 4), -- Accountant, reports to Account Manager
    ('Bob', 'Brown', 4, 2), -- Account Manager, reports to Jane
    ('Emily', 'Clark', 3, NULL); -- Legal Advisor, no manager

    TRUNCATE employee RESTART IDENTITY CASCADE;
TRUNCATE role RESTART IDENTITY CASCADE;
TRUNCATE department RESTART IDENTITY CASCADE;