const db = require("../db/db");


exports.createTask = (req, res) => {
    const { user_id, title, description, status, due_date } = req.body;

    if (!user_id || !title || !description || !status || !due_date) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const query = "INSERT INTO tasks (user_id, title, description, status, due_date) VALUES (?, ?, ?, ?, ?)";
    
    db.query(query, [user_id, title, description, status, due_date], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error creating task", error: err });
        }
        res.status(201).json({ message: "Task created successfully", taskId: result.insertId });
    });
};


exports.getTasks = (req, res) => {
    const { user_id, status, due_date } = req.query; // Get user_id, status, and due_date from query parameters

    let query = "SELECT * FROM tasks WHERE 1 = 1"; // This helps build flexible queries
    let params = [];

    if (user_id) {
        query += " AND user_id = ?";
        params.push(user_id);
    }

    if (status) {
        query += " AND status = ?";
        params.push(status);
    }

    if (due_date) {
        // Assuming the query 'due_date' is in the format YYYY-MM-DD (e.g., '2025-02-18')
        query += " AND DATE(due_date) = ?";
        params.push(due_date); // MySQL will automatically match just the date part
    }

    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching tasks", error: err });
        if (results.length === 0) {
            return res.status(404).json({ message: "No tasks found for the given filters" });
        }
        res.status(200).json(results);
    });
};


exports.deeleteTask=(req,res)=>{
    const { id } = req.params; // Get the task ID from the URL parameter

    // SQL query to delete the task
    const query = 'DELETE FROM tasks WHERE id = ?';
    const params = [id];
  
    db.query(query, params, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error deleting task', error: err });
      }
  
      // If no rows were deleted, task with that ID doesn't exist
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.status(200).json({ message: 'Task deleted successfully' });
    });
}

exports.getTaskById=(req,res)=>{
    const { id } = req.params; // Get the task ID from the URL parameter

    // SQL query to fetch the task by ID
    const query = 'SELECT * FROM tasks WHERE id = ?';
    const params = [id];
  
    db.query(query, params, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching task', error: err });
      }
  
      // If no task is found with the given ID
      if (result.length === 0) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.status(200).json(result[0]); // Return the task details
    });
}


exports.updateTask=(req,res)=>{
    const { id } = req.params; // Task ID from URL params
    const { status } = req.body; // New status from request body
  
    // Validate status
    if (!['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // Query to update the status of the task
    const query = 'UPDATE tasks SET status = ? WHERE id = ?';
  
    db.query(query, [status, id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err });
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      return res.status(200).json({ message: 'Task updated successfully', status });
    });
}