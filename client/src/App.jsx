import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  
  // 1. Bonus Feature: Filter State
  const [filterStatus, setFilterStatus] = useState('All');

  // Environment Variable चा वापर
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/tasks';

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required!');
      return;
    }
    setError('');

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, { title, description, status });
        setEditId(null);
      } else {
        await axios.post(API_URL, { title, description, status });
      }
      setTitle('');
      setDescription('');
      setStatus('Pending');
      fetchTasks();
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  const handleEdit = (task) => {
    setEditId(task._id);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchTasks();
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    }
  };

  // 2. Bonus Feature: Tasks Filter करण्याचे लॉजिक
  const filteredTasks = tasks.filter(task => {
    if (filterStatus === 'All') return true;
    return task.status === filterStatus;
  });

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', fontFamily: 'Arial', color: '#fff' }}>
      <h2 style={{ textAlign: 'center' }}>📝 Task Tracker (MERN)</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
        <input 
          type="text" 
          placeholder="Task Title *" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc', color: '#000' }}
        />
        {error && <span style={{ color: '#ff6b6b', fontSize: '14px' }}>{error}</span>}

        <textarea 
          placeholder="Task Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: '10px', fontSize: '16px', height: '60px', borderRadius: '5px', border: '1px solid #ccc', color: '#000' }}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', color: '#000' }}>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px', borderRadius: '5px' }}>
          {editId ? '✏️ Update Task' : '➕ Add Task'}
        </button>
      </form>

      <hr />

      {/* Bonus Feature: Filter UI */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0' }}>
        <h3>Your Tasks</h3>
        <div>
          <label style={{ marginRight: '10px' }}>Filter by Status: </label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: '5px', borderRadius: '3px', color: '#000' }}>
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {filteredTasks.length === 0 ? <p style={{ textAlign: 'center', color: '#ccc' }}>No tasks found.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredTasks.map((task) => (
            <div key={task._id} style={{ padding: '15px', border: '1px solid #444', borderRadius: '5px', backgroundColor: '#222' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, color: '#fff' }}>{task.title}</h4>
                <span style={{ 
                  padding: '3px 8px', 
                  borderRadius: '3px', 
                  fontSize: '12px', 
                  fontWeight: 'bold',
                  backgroundColor: task.status === 'Completed' ? '#d4edda' : task.status === 'In Progress' ? '#fff3cd' : '#f8d7da',
                  color: task.status === 'Completed' ? '#155724' : task.status === 'In Progress' ? '#856404' : '#721c24'
                }}>
                  {task.status}
                </span>
              </div>
              <p style={{ color: '#aaa', fontSize: '14px', marginTop: '10px' }}>{task.description}</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button onClick={() => handleEdit(task)} style={{ cursor: 'pointer', padding: '5px 10px', borderRadius: '3px', border: 'none', backgroundColor: '#ffc107', color: '#000' }}>Edit</button>
                <button onClick={() => handleDelete(task._id)} style={{ cursor: 'pointer', padding: '5px 10px', borderRadius: '3px', backgroundColor: '#dc3545', color: 'white', border: 'none' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;