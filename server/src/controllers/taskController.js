import Task from '../models/Task.js';

const populateTask = [
  { path: 'lead', select: 'name email status' },
  { path: 'assignedTo', select: 'name email' },
];

export async function listTasks(req, res, next) {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;
    if (req.query.lead) filter.lead = req.query.lead;
    const tasks = await Task.find(filter).populate(populateTask).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
}

export async function createTask(req, res, next) {
  try {
    const task = await Task.create(req.body);
    const saved = await Task.findById(task._id).populate(populateTask);
    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
}

export async function updateTaskStatus(req, res, next) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      const error = new Error('Task not found');
      error.status = 404;
      throw error;
    }

    const isOwner = task.assignedTo.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      const error = new Error('Only the assigned user can update this task');
      error.status = 403;
      throw error;
    }

    task.status = req.body.status;
    await task.save();
    const saved = await Task.findById(task._id).populate(populateTask);
    res.json(saved);
  } catch (error) {
    next(error);
  }
}
