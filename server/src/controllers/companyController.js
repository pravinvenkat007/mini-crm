import Company from '../models/Company.js';
import Lead from '../models/Lead.js';

export async function listCompanies(_req, res, next) {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.json(companies);
  } catch (error) {
    next(error);
  }
}

export async function createCompany(req, res, next) {
  try {
    const company = await Company.create(req.body);
    res.status(201).json(company);
  } catch (error) {
    next(error);
  }
}

export async function getCompany(req, res, next) {
  try {
    const [company, leads] = await Promise.all([
      Company.findById(req.params.id),
      Lead.find({ company: req.params.id, isDeleted: false })
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 }),
    ]);
    if (!company) {
      const error = new Error('Company not found');
      error.status = 404;
      throw error;
    }
    res.json({ company, leads });
  } catch (error) {
    next(error);
  }
}
