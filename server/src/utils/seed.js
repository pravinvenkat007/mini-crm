import dotenv from 'dotenv';
import Company from '../models/Company.js';
import Lead from '../models/Lead.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { connectDB } from './db.js';

dotenv.config();

await connectDB();

await Promise.all([
  User.deleteMany({}),
  Company.deleteMany({}),
  Lead.deleteMany({}),
  Task.deleteMany({}),
]);

const [admin, user] = await User.create([
  { name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'admin' },
  { name: 'John Sales', email: 'john@example.com', password: 'password123', role: 'user' },
]);

const [acme, zenith] = await Company.create([
  { name: 'ABC Corp', industry: 'IT', location: 'Chennai', website: 'https://example.com' },
  { name: 'Zenith Traders', industry: 'Retail', location: 'Bengaluru' },
]);

const [ravi, priya] = await Lead.create([
  {
    name: 'Ravi Kumar',
    email: 'ravi@example.com',
    phone: '9876543210',
    status: 'New',
    assignedTo: user._id,
    company: acme._id,
  },
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '9876501234',
    status: 'Qualified',
    assignedTo: admin._id,
    company: zenith._id,
  },
]);

await Task.create([
  {
    title: 'Call Ravi',
    lead: ravi._id,
    assignedTo: user._id,
    dueDate: new Date(),
    status: 'Pending',
  },
  {
    title: 'Send proposal',
    lead: priya._id,
    assignedTo: admin._id,
    dueDate: new Date(),
    status: 'Completed',
  },
]);

console.log('Seed complete. Login with admin@example.com / password123');
process.exit(0);
