import React, { useState, useEffect } from 'react';
import './App.css';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // This line is needed for accessibility reasons

function Task({ task }) {
  return <div className="task">{task}</div>;
}

function Column({ status, tasks, setTasks }) {
  return (
    <div className="column">
      <h2>{status}</h2>
      {tasks[status].map(task => (
        <Task key={task.id} task={task} />
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
  const [status, setStatus] = useState('To-Do'); // State to hold the status
  const [modalIsOpen, setModalIsOpen] = useState(false); // State to control the modal

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
      newTasks[status][newTasks[status].length - 1] = newTask;
      setTasks(newTasks);
      setNewTask('');
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const handleDeleteTaskSubmit = (event) => {
    event.preventDefault();
  
    setTasks(prevTasks => {
      const updatedTasks = { ...prevTasks };
      updatedTasks[status] = updatedTasks[status].filter(task => task !== newTask); // Use the current status instead of 'To-Do'
      return updatedTasks;
    });
    setNewTask('');
  };
  const handleAddTaskSubmit = (event) => {
    event.preventDefault();
  
    fetch('http://localhost:8080/add_tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task: newTask }),
    })
    .then(() => {
      const newTasks = { ...tasks };
      newTasks[status] = [...newTasks[status], newTask]; // Use the current status instead of 'To-Do'
      setTasks(newTasks);
      setNewTask(''); 
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  log_data({ data });
  //tasks[0].push(data)

  return (
    <div className="App">
      <h1>Group 8 Project</h1>
      {Object.keys(tasks).map(status => (
        <Column
          key={status}
          status={status}
          tasks={tasks}
          handleAddTaskSubmit={handleAddTaskSubmit}
          handleUpdateTaskSubmit={handleUpdateTaskSubmit}
          handleDeleteTaskSubmit={handleDeleteTaskSubmit}
        />
      ))}
      <button onClick={() => setModalIsOpen(true)}>Manage Tasks</button>
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <form>
          <input type="text" value={newTask} onChange={e => setNewTask(e.target.value)} />
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="To-Do">To-Do</option>
            <option value="Doing">Doing</option>
            <option value="Done">Done</option>
            <option value="Dropped">Dropped</option>
          </select>
          <button type="button" onClick={handleAddTaskSubmit}>Add Task</button>
          <button type="button" onClick={handleUpdateTaskSubmit}>Update Task</button>
          <button type="button" onClick={handleDeleteTaskSubmit}>Delete Task</button>
        </form>
      </Modal>
    </div>
  );
}

export default App;