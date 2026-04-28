import Lead from '../models/Lead.js';

const populateLead = [
  { path: 'assignedTo', select: 'name email' },
  { path: 'company', select: 'name industry location' },
];

export async function listLeads(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const { search, status, company, assignedTo } = req.query;
    const filter = { isDeleted: false };

    if (status) filter.status = status;
    if (company) filter.company = company;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      Lead.find(filter)
        .populate(populateLead)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Lead.countDocuments(filter),
    ]);

    res.json({ items, page, limit, total, pages: Math.ceil(total / limit) || 1 });
  } catch (error) {
    next(error);
  }
}

export async function getLead(req, res, next) {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, isDeleted: false }).populate(populateLead);
    if (!lead) {
      const error = new Error('Lead not found');
      error.status = 404;
      throw error;
    }
    res.json(lead);
  } catch (error) {
    next(error);
  }
}

export async function createLead(req, res, next) {
  try {
    const lead = await Lead.create(req.body);
    const saved = await Lead.findById(lead._id).populate(populateLead);
    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
}

export async function updateLead(req, res, next) {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true, runValidators: true },
    ).populate(populateLead);
    if (!lead) {
      const error = new Error('Lead not found');
      error.status = 404;
      throw error;
    }
    res.json(lead);
  } catch (error) {
    next(error);
  }
}

export async function deleteLead(req, res, next) {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true },
    );
    if (!lead) {
      const error = new Error('Lead not found');
      error.status = 404;
      throw error;
    }
    res.json({ message: 'Lead deleted' });
  } catch (error) {
    next(error);
  }
}
