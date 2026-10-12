const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'qwerty',
    database: 'todo_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    try {
        const [tasks] = await pool.execute('SELECT * FROM todos'); 
        res.render('index', { tasks: tasks, error: null });
    } catch (error) {
        console.error(error);
        res.status(500).send('Andmebaasi viga');
    }
});

app.post('/', async (req, res) => {
    const taskText = req.body.task ? req.body.task.trim() : '';
    if (taskText.length === 0) {
        const error = 'Please insert correct task data';
        try {
            const [tasks] = await pool.execute('SELECT * FROM todos'); 
            return res.render('index', { tasks: tasks, error: error });
        } catch (error) {
            console.error(error);
            return res.status(500).send('Andmebaasi viga');
        }
    } 

    try {
        await pool.execute('INSERT INTO todos (task) VALUES (?)', [taskText]);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Andmebaasi viga');
    }
});

app.get('/delete-task/:taskId', async (req, res) => {
    const taskId = parseInt(req.params.taskId);
    try {
        await pool.execute('DELETE FROM todos WHERE id = ?', [taskId]);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Andmebaasi viga');
    }
});

app.get('/update-task/:taskId', async (req, res) => {
    const updatedTaskId = parseInt(req.params.taskId);
    try {
        const [rows] = await pool.execute('SELECT * FROM todos WHERE id = ?', [updatedTaskId]);
        if (rows.length > 0) {
            res.render('update', { task: rows[0], error: null });
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Andmebaasi viga');
    }
});

app.post('/update-task/:taskId', async (req, res) => {
    const updatedTaskId = parseInt(req.params.taskId);
    const updatedTaskText = req.body.task ? req.body.task.trim() : '';
    
    try {
        await pool.execute('UPDATE todos SET task = ? WHERE id = ?', [updatedTaskText, updatedTaskId]);
        res.redirect('/');
        } catch (error) {
            console.error(error);
            res.status(500).send('Andmebaasi viga');
        }
        return;
    }
);

app.get('/delete-tasks', async (req, res) => {
    try {
        await pool.execute('DELETE FROM todos');
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Andmebaasi viga');
    }
});

app.delete('/todos', async (req, res) => {
    try {
        await pool.execute('TRUNCATE TABLE todos');
        res.status(200).send('All tasks deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Database error');
    }
});

app.listen(3001, () => {
    console.log('Example app is started at http://localhost:3001');
});