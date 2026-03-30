import crypto from 'crypto';
import db from '../db/database.js';

const rewardCatalogue = [
  { id: 1, name: 'Free Small Fries', points_cost: 200, description: 'Redeemable on your next order' },
  { id: 2, name: 'Free Whopper', points_cost: 500, description: 'The big one — on us' },
  { id: 3, name: 'Free Combo Upgrade', points_cost: 150, description: 'Upgrade any meal to a combo' },
  { id: 4, name: 'Free Onion Rings', points_cost: 100, description: 'Golden and crispy' },
  { id: 5, name: 'Free Chocolate Shake', points_cost: 300, description: 'Thick and creamy' },
];

function getTierForPoints(points) {
  if (points >= 1500) return { tier: 'Whopper King', next_tier: null, points_to_next_tier: 0 };
  if (points >= 500) return { tier: 'Flame Boss', next_tier: 'Whopper King', points_to_next_tier: 1500 - points };
  return { tier: 'Grillmaster', next_tier: 'Flame Boss', points_to_next_tier: 500 - points };
}

export function getRewardsProfile(req, res) {
  const user = db.prepare('SELECT first_name, email, points, tier FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const earned = db.prepare(`
    SELECT id, points_earned AS points, created_at
    FROM orders WHERE user_id = ? AND points_earned > 0
    ORDER BY datetime(created_at) DESC LIMIT 5
  `).all(req.user.id).map((row) => ({
    type: 'earned',
    points: row.points,
    description: `Order #${row.id}`,
    date: row.created_at.slice(0, 10),
  }));

  const spent = db.prepare(`
    SELECT reward, points_used, redeemed_at
    FROM redemptions WHERE user_id = ?
    ORDER BY datetime(redeemed_at) DESC LIMIT 5
  `).all(req.user.id).map((row) => ({
    type: 'redeemed',
    points: row.points_used,
    description: row.reward,
    date: row.redeemed_at.slice(0, 10),
  }));

  const recent_activity = [...earned, ...spent]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const tierInfo = getTierForPoints(user.points);
  res.json({
    user: {
      ...user,
      points_to_next_tier: tierInfo.points_to_next_tier,
      next_tier: tierInfo.next_tier,
    },
    recent_activity,
  });
}

export function getRewardsCatalogue(req, res) {
  res.json({ rewards: rewardCatalogue });
}

export function redeemReward(req, res) {
  const reward = rewardCatalogue.find((item) => item.id === req.body.reward_id);
  if (!reward) {
    return res.status(404).json({ error: 'Reward not found' });
  }

  const user = db.prepare('SELECT id, points FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (user.points < reward.points_cost) {
    return res.status(400).json({ error: 'Insufficient points' });
  }

  const pointsRemaining = user.points - reward.points_cost;
  const tierInfo = getTierForPoints(pointsRemaining);

  const transaction = db.transaction(() => {
    db.prepare('UPDATE users SET points = ?, tier = ? WHERE id = ?').run(pointsRemaining, tierInfo.tier, req.user.id);
    db.prepare('INSERT INTO redemptions (user_id, reward, points_used) VALUES (?, ?, ?)').run(req.user.id, reward.name, reward.points_cost);
  });
  transaction();

  const voucherCode = `BK-REWARD-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
  res.json({
    success: true,
    voucher_code: voucherCode,
    reward: reward.name,
    points_used: reward.points_cost,
    points_remaining: pointsRemaining,
    message: 'Your voucher has been issued! Show it at the counter.',
  });
}
