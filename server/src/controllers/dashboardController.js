import Lead from '../models/Lead.js';
import Task from '../models/Task.js';

export async function getDashboard(req, res, next) {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const [totalLeads, qualifiedLeads, tasksDueToday, completedTasks] = await Promise.all([
      Lead.countDocuments({ isDeleted: false }),
      Lead.countDocuments({ isDeleted: false, status: 'Qualified' }),
      Task.countDocuments({ dueDate: { $gte: start, $lt: end }, status: { $ne: 'Completed' } }),
      Task.countDocuments({ status: 'Completed' }),
    ]);

    res.json({ totalLeads, qualifiedLeads, tasksDueToday, completedTasks });
  } catch (error) {
    next(error);
  }
}
