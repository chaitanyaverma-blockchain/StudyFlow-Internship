// Temporary In-Memory Storage for Tasks
// Data is erased every time the server restarts.

const tasks = [];
let nextId = 1;

module.exports = {
  getTasks: () => tasks,
  
  getTaskById: (id) => tasks.find(t => t.id === parseInt(id, 10)),
  
  addTask: (taskData) => {
    const newTask = {
      id: nextId++,
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    return newTask;
  },
  
  updateTask: (id, taskData) => {
    const taskIndex = tasks.findIndex(t => t.id === parseInt(id, 10));
    if (taskIndex === -1) return null;
    
    // Preserve id and createdAt
    const existingTask = tasks[taskIndex];
    tasks[taskIndex] = {
      ...existingTask,
      ...taskData,
      id: existingTask.id,
      createdAt: existingTask.createdAt
    };
    
    return tasks[taskIndex];
  },
  
  deleteTask: (id) => {
    const taskIndex = tasks.findIndex(t => t.id === parseInt(id, 10));
    if (taskIndex === -1) return false;
    
    tasks.splice(taskIndex, 1);
    return true;
  },
  
  updateTaskStatus: (id, completed) => {
    const taskIndex = tasks.findIndex(t => t.id === parseInt(id, 10));
    if (taskIndex === -1) return null;
    
    tasks[taskIndex].completed = completed;
    return tasks[taskIndex];
  }
};
