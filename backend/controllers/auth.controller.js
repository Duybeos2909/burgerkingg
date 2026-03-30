import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import db from '../db/database.js';

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, first_name: user.first_name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function publicUser(user) {
  return {
    id: user.id,
    first_name: user.first_name,
    email: user.email,
    points: user.points,
    tier: user.tier,
  };
}

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

async function sendWelcomeEmail(email, firstName) {
  const transporter = getTransporter();
  if (!transporter) return;

  const voucher = `WELCOME-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'Burger King <no-reply@bk.com>',
    to: email,
    subject: 'Welcome to BK Rewards 🔥',
    text: `Welcome to BK Rewards, ${firstName}! 🔥 Here's your free Whopper voucher: ${voucher}`,
  });
}

export async function register(req, res) {
  const { first_name, email, password, dob, postcode } = req.body;

  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  if (existingUser) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const insert = db.prepare(`
    INSERT INTO users (first_name, email, password, dob, postcode, points, tier)
    VALUES (?, ?, ?, ?, ?, 0, 'Grillmaster')
  `);

  const result = insert.run(first_name, email.toLowerCase(), hashedPassword, dob || null, postcode || null);
  const user = db.prepare('SELECT id, first_name, email, points, tier FROM users WHERE id = ?').get(result.lastInsertRowid);

  try {
    await sendWelcomeEmail(user.email, user.first_name);
  } catch (error) {
    console.warn('Welcome email skipped:', error.message);
  }

  res.status(201).json({
    success: true,
    token: signToken(user),
    user: publicUser(user),
  });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({
    success: true,
    token: signToken(user),
    user: publicUser(user),
  });
}

export function me(req, res) {
  const user = db.prepare('SELECT id, first_name, email, dob, postcode, points, tier, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ success: true, user });
}

export function logout(req, res) {
  res.json({ success: true });
}
