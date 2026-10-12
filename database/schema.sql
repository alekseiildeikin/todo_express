CREATE DATABASE IF NOT EXISTS todo_db;
USE todo_db;

CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task VARCHAR(255) NOT NULL
);

INSERT INTO todos (task) VALUES
    ('Osta piima ja leiba'),
    ('Pese auto puhtaks'),
    ('Tee Node.js praktiline töö valmis');