const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
//use cors
const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//POSTGRESS
const Pool = require('pg').Pool;

const pool = new Pool({
	user: 'postgres',
	host: 'postgres.localhost',
	database: 'postgres',
	password: 'leamsigc',
	port: 5432
});

//create table of tasks
const createTableString = `
    CREATE TABLE IF NOT EXISTS tasks(
        task_id SERIAL PRIMARY KEY,
        task_name VARCHAR(255) NOT NULL,
        is_done boolean NOT NULL DEFAULT false
    );
`;
pool.query(createTableString, (err, res) => {
	if (err) console.log(err);
	else {
		console.log(res);
	}
});

//CRUD TO POSTGRES DATABASE
//create
const createTask = (name, callBack) => {
	pool.query('INSERT INTO tasks (task_name) VALUES ($1) RETURNING *;', [name], (err, res) => {
		if (err) {
			callBack(err, null);
		} else {
			callBack(null, res.rows[0]);
		}
	});
};
//get all
const getAllTasks = callBack => {
	pool.query('SELECT * FROM tasks;', (err, res) => {
		if (err) {
			callBack(err, null);
		} else {
			callBack(null, res.rows);
		}
	});
};
//delete
const deleteTask = (id, callBack) => {
	pool.query('DELETE FROM tasks WHERE task_id= $1', [id], (err, res) => {
		if (err) {
			callBack(err);
		} else {
			callBack(null);
		}
	});
};
//update
const updateTask = (isDone, id, callBack) => {
	pool.query('UPDATE tasks SET is_done = $1 WHERE task_id = $2 RETURNING *;', [isDone, id], (err, res) => {
		if (err) {
			callBack(err, null);
		} else {
			callBack(null, res.rows[0]);
		}
	});
};

//home page
app.get('/', (req, res) => {
	res.send('hello from the app ');
});

//ROUTE add new task
app.put('/api/tasks/', (req, res) => {
	const newTaskName = req.body.name;
	console.log(newTaskName);
	createTask(newTaskName, (err, task) => {
		if (err) {
			res.sendStatus(500);
		} else {
			res.send(JSON.stringify(task));
		}
	});
});

//get all tasks
app.get('/api/tasks', (req, res) => {
	getAllTasks((err, tasks) => {
		if (err) {
			res.sendStatus(500);
		} else {
			res.send(JSON.stringify(tasks));
		}
	});
});
//delete TASKS
app.delete('/api/tasks/:id', (req, res) => {
	const id = req.params.id;
	deleteTask(id, err => {
		if (err) {
			res.sendStatus(500);
		} else {
			res.sendStatus(200);
		}
	});
});

//update task
app.post('/api/tasks/:id', (req, res) => {
	const id = req.params.id;
	const isDone = req.body.isDone;

	updateTask(id, isDone, (err, task) => {
		if (err) {
			res.sendStatus(500);
		} else {
			res.send(JSON.stringify(task));
		}
	});
});
app.listen(PORT, () => {
	console.log(`app listening in port ${PORT}`);
});
