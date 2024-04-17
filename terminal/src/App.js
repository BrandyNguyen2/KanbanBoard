import React, { useState, useEffect } from 'react';
import './App.css';



function Task({ task }) {
  return <div className="task">{task}</div>;
}

function Column({ status, tasks }) {
  return (
    <div className="column">
      <h2>{status}</h2>
      {tasks[status].map(task => (
        <Task key={task} task={task} />
      ))}
    </div>
  );
}

function log_data({ data }) {
  console.log("this function handles our data", data);
}

function App() {
  const [tasks, setTasks] = useState({
    'To-Do': [],
    'Doing': [],
    'Done': [],
    'Dropped': []
  });

  const [newTask, setNewTask] = useState(''); // State to hold the new task
  const [data, setData] = useState('');
  
  useEffect(() => {
    fetch('http://localhost:8080/get_tasks')
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data[0]);
        setData(data[0]['task']);
        //setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);
  
  const handleUpdateTaskSubmit = (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page
  
    // Here you would send the updated task to your backend
    fetch('http://localhost:8080/update_tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task: newTask }),
    })
    .then(() => {
      const newTasks = { ...tasks };
      newTasks['To-Do'][newTasks['To-Do'].length - 1] = newTask;
      setTasks(newTasks);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };
  

  const handleDeleteTaskSubmit = (event) => {
    event.preventDefault();
    // Delete task logic here
    setTasks(prevTasks => {
      const updatedTasks = { ...prevTasks };
      updatedTasks['To-Do'].pop();
      return updatedTasks;
    });
  }
  const handleAddTaskSubmit = (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page
    // Here you would send the new task to your backend
    fetch('http://localhost:8080/add_tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task: newTask }),
    });
    setTasks(prevTasks => ({
      ...prevTasks,
      'To-Do': [...prevTasks['To-Do'], newTask]
    }));
    setNewTask(''); // Clear the input
  };

  log_data({ data });
  //tasks[0].push(data)

  return (
    <div className="App">
      <h1>Group 8 Project</h1>
      <form>
        <input type="text" value={newTask} onChange={e => setNewTask(e.target.value)} />
        <button type="button" onClick={handleAddTaskSubmit}>Add Task</button>
        <button type="button" onClick={handleUpdateTaskSubmit}>Update Task</button>
        <button type="button" onClick={handleDeleteTaskSubmit}>Delete Task</button>
      </form>
      {Object.keys(tasks).map(status => (
        <Column key={status} status={status} tasks={tasks}/>
      ))}
    </div>
  );
}
export default App;