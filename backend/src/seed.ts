import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/user.model';
import Deal from './models/deal.model';
import Claim from './models/claim.model';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/startup-benefits';

const sampleDeals = [
  {
    title: 'Stripe - Startup Program',
    description: 'Get 0% fees on your first $1M in payments processed. Stripe offers powerful tools for online businesses including payment processing, subscriptions, and business analytics.',
    provider: 'Stripe',
    isLocked: false,
    tags: ['Payments', 'SaaS', 'Finance'],
    expiresAt: new Date('2025-12-31'),
  },
  {
    title: 'GitHub Copilot - Student Free',
    description: 'Free access to GitHub Copilot for verified students. AI-powered code completion that helps you write better code, faster.',
    provider: 'GitHub',
    isLocked: true,
    tags: ['DevTools', 'AI', 'Coding'],
    expiresAt: new Date('2026-06-30'),
  },
  {
    title: 'Notion - Personal Free',
    description: 'Free personal plan with unlimited pages and blocks. Notion is an all-in-one workspace for notes, docs, and collaboration.',
    provider: 'Notion',
    isLocked: false,
    tags: ['Productivity', 'Notes', 'Collaboration'],
  },
  {
    title: 'Vercel - Pro Free for Open Source',
    description: 'Free Pro tier for open source maintainers. Vercel provides the best platform for deploying web applications with zero configuration.',
    provider: 'Vercel',
    isLocked: true,
    tags: ['DevOps', 'Hosting', 'Web'],
    expiresAt: new Date('2025-12-31'),
  },
  {
    title: 'Slack - Free Forever',
    description: 'Free access for teams with unlimited users and 90-day message history. Slack brings all your communication together.',
    provider: 'Slack',
    isLocked: false,
    tags: ['Communication', 'Team', 'Chat'],
  },
  {
    title: 'Figma - Professional Free',
    description: 'Free Professional plan for small teams up to 3 editors. Figma is the leading collaborative design tool.',
    provider: 'Figma',
    isLocked: false,
    tags: ['Design', 'UI/UX', 'Collaboration'],
    expiresAt: new Date('2025-09-30'),
  },
  {
    title: 'AWS Activate - Credits Program',
    description: 'Get up to $100,000 in credits across AWS services. Validated startups can access cloud computing resources for free.',
    provider: 'Amazon Web Services',
    isLocked: true,
    tags: ['Cloud', 'Infrastructure', 'Credits'],
    expiresAt: new Date('2025-12-31'),
  },
  {
    title: 'Linear - Free for Teams',
    description: 'Free plan for small teams with unlimited issues and projects. Linear is a modern issue tracking tool.',
    provider: 'Linear',
    isLocked: false,
    tags: ['Project Management', 'DevTools', 'Workflow'],
  },
];

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Deal.deleteMany({}),
      Claim.deleteMany({}),
    ]);
    console.log('🗑️ Cleared existing data');

    // Create users with real password hashes
    const passwordHash = await bcrypt.hash('demo123', 10);
    const users = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash,
        isVerified: true,
        role: 'user',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        passwordHash,
        isVerified: false,
        role: 'user',
      },
    ]);
    console.log(`👤 Created ${users.length} users`);

    // Create deals
    const deals = await Deal.insertMany(sampleDeals);
    console.log(`📦 Created ${deals.length} deals`);

    // Create a sample claim for John
    await Claim.create({
      user: users[0]._id,
      deal: deals[0]._id,
      status: 'approved',
    });
    console.log('🎫 Created sample claim');

    console.log('\n✨ Seed completed successfully!\n');
    console.log('📋 Sample Accounts:');
    console.log('   - john@example.com (verified) - password: demo123');
    console.log('   - jane@example.com (unverified) - password: demo123\n');
    console.log('🔗 Connection string:', MONGODB_URI);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();

