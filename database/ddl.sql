SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

-- Create Goals Table
CREATE TABLE Goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Populate the Goals table with sample data
INSERT INTO Goals (name, description) VALUES 
    ('5K Run', 'Run a distance of 5 kilometers.'),
    ('10K Run', 'Run a distance of 10 kilometers.'),
    ('Half Marathon', 'Run a distance of 21.0975 kilometers (13.1 miles).'),
    ('Marathon', 'Run a distance of 42.195 kilometers (26.2 miles).');

-- Create Users Table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);

-- Create RunningLogs Table
CREATE TABLE RunningLogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    goalId INT NOT NULL,
    distance FLOAT NOT NULL,
    duration INT NOT NULL,
    notes TEXT,
    pace FLOAT NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (goalId) REFERENCES Goals(id)
);

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;


