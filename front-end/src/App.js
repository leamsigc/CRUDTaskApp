import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tasks: [],
			taskName: ''
		};
	}
	//get initial app state
	componentDidMount() {
		axios
			.get(`http://localhost:5000/api/tasks`)
			.then(res => {
				this.setState({
					tasks: res.data
				});
			})
			.catch(err => console.log(err));
	}
	//handle submit
	handleSubmit = e => {
		e.preventDefault();
		const { taskName, tasks } = this.state;
		if (!taskName || taskName === null) {
			return;
		} else {
			axios
				.put(`http://localhost:5000/api/tasks`, {
					name: taskName
				})
				.then(res => {
					this.setState({
						tasks: [...tasks, res.data],
						taskName: ''
					}).catch(err => console.log(err));
				});
		}
	};
	//handle change
	handleChange = e => {
		this.setState({
			taskName: e.target.value
		});
	};
	//handle toggle
	handleToggle = task => {
		axios
			.post(`http://localhost:5000/api/tasks/${task.task_id}`, { isDone: !task.is_done })
			.then(res => {
				const updatedTask = res.data;
				this.setState({
					tasks: this.state.tasks.map(item => {
						if (item.task_id === updatedTask.task_id) {
							return updatedTask;
						} else {
							return item;
						}
					})
				});
			})
			.catch(err => console.log(err));
	};
	handleDelete = id => {
		axios
			.delete(`http://localhost:5000/api/tasks/${id}`)
			.then(res => {
				if (res.data === 'OK') {
					this.setState({
						tasks: this.state.tasks.filter(item => item.task_id !== id)
					});
				}
			})
			.catch(err => console.log(err));
	};
	render() {
		const { tasks } = this.state;
		return (
			<div className="App">
				<h1>Task Tracker</h1>
				<main>
					<form onSubmit={this.handleSubmit}>
						<input onChange={this.handleChange} type="text" placeholder="Please enter a new task" />
						<button type="submit">ADD</button>
					</form>
				</main>
				<header className="App-header">
					<ul>
						{tasks.map(item => {
							return (
								<li key={item.task_id}>
									<input type="checkbox" checked={item.is_done} onChange={() => this.handleToggle(item)} />
									{item.task_name}
									<button onClick={() => this.handleDelete(item.task_id)}>Delete</button>
								</li>
							);
						})}
					</ul>
				</header>
			</div>
		);
	}
}

export default App;
