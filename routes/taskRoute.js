const express = require("express");
const { createTask, getTasks, deeleteTask, getTaskById, updateTask } = require("../controllers/taskController");
const { Middleware } = require("../middleware/middleware");


const router = express.Router();


// Define routes
router.post("/",Middleware,createTask); // Create a new task
router.get("/",Middleware, getTasks); // Get all tasks
router.get("/:id",Middleware, getTaskById); // Get a single task by ID
router.put("/:id",Middleware,updateTask); // Update a task
router.delete("/:id",Middleware, deeleteTask); // Delete a task

module.exports = router;
