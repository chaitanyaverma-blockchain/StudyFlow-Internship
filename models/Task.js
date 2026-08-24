const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  taskTitle: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    minlength: [3, 'Task title must be at least 3 characters'],
    maxlength: [80, 'Task title cannot exceed 80 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  deadline: {
    type: String, // Kept as string to maintain compatibility with existing 'YYYY-MM-DD' logic
    required: [true, 'Deadline is required'],
    index: true
  },
  priority: {
    type: String,
    required: [true, 'Priority is required'],
    enum: ['High', 'Medium', 'Low']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Assignment', 'Exam Preparation', 'Project', 'Revision', 'Other']
  },
  customCategory: {
    type: String,
    trim: true
  },
  estimatedHours: {
    type: Number,
    required: [true, 'Estimated hours is required'],
    min: [0.01, 'Estimated hours must be greater than zero'],
    max: [100, 'Estimated hours must be 100 or less']
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
