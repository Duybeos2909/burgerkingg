import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const token = header.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function attachUserIfPresent(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next();

  try {
    const token = header.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    req.user = null;
  }

  next();
}

export function requireAdmin(req, res, next) {
  if (!req.user?.email) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@bk.com';
  if (req.user.email !== adminEmail) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
}
