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

function getMultiplierForPoints(points) {
  if (points >= 1500) return 15;
  if (points >= 500) return 12;
  return 10;
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

  const externalEarned = db.prepare(`
    SELECT external_order_id AS id, points_earned AS points, updated_at AS created_at
    FROM external_loyalty_awards
    WHERE user_id = ? AND is_active = 1 AND points_earned > 0
    ORDER BY datetime(updated_at) DESC LIMIT 5
  `).all(req.user.id).map((row) => ({
    type: 'earned',
    points: row.points,
    description: `Order ${row.id}`,
    date: row.created_at.slice(0, 10),
  }));

  const recent_activity = [...earned, ...externalEarned, ...spent]
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

export function getAdminRewardsStatus(req, res) {
  res.json({ success: true, is_admin: true, email: req.user.email });
}

export function syncExternalOrderPayment(req, res) {
  const { external_order_id: orderId, customer_email: customerEmail, total_cents: totalCents, paid } = req.body;
  const normalizedEmail = customerEmail.toLowerCase();
  const registeredUser = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
  if (!registeredUser) {
    return res.json({ success: true, awarded: false, reason: 'user_not_found' });
  }

  const syncPayment = db.transaction(() => {
    const existing = db.prepare('SELECT * FROM external_loyalty_awards WHERE external_order_id = ?').get(orderId);
    if (existing && (existing.user_id !== registeredUser.id || existing.total_cents !== totalCents)) {
      const error = new Error('Order award details do not match the existing record.');
      error.status = 409;
      throw error;
    }

    const user = db.prepare('SELECT id, points FROM users WHERE id = ?').get(registeredUser.id);
    if (paid) {
      if (existing?.is_active) {
        return { awarded: true, points_earned: existing.points_earned, user };
      }

      const pointsEarned = Math.floor((totalCents / 100) * getMultiplierForPoints(user.points));
      const nextPoints = user.points + pointsEarned;
      const tierInfo = getTierForPoints(nextPoints);
      if (existing) {
        db.prepare(`
          UPDATE external_loyalty_awards
          SET points_earned = ?, is_active = 1, updated_at = datetime('now')
          WHERE external_order_id = ?
        `).run(pointsEarned, orderId);
      } else {
        db.prepare(`
          INSERT INTO external_loyalty_awards
            (external_order_id, user_id, customer_email, total_cents, points_earned, is_active)
          VALUES (?, ?, ?, ?, ?, 1)
        `).run(orderId, user.id, normalizedEmail, totalCents, pointsEarned);
      }
      db.prepare('UPDATE users SET points = ?, tier = ? WHERE id = ?').run(nextPoints, tierInfo.tier, user.id);
      return {
        awarded: true,
        points_earned: pointsEarned,
        user: { id: user.id, points: nextPoints, tier: tierInfo.tier },
      };
    }

    if (!existing?.is_active) {
      return { awarded: false, points_earned: 0, user };
    }

    const nextPoints = Math.max(0, user.points - existing.points_earned);
    const tierInfo = getTierForPoints(nextPoints);
    db.prepare(`
      UPDATE external_loyalty_awards SET is_active = 0, updated_at = datetime('now')
      WHERE external_order_id = ?
    `).run(orderId);
    db.prepare('UPDATE users SET points = ?, tier = ? WHERE id = ?').run(nextPoints, tierInfo.tier, user.id);
    return {
      awarded: false,
      points_earned: existing.points_earned,
      user: { id: user.id, points: nextPoints, tier: tierInfo.tier },
    };
  });

  res.json({ success: true, ...syncPayment() });
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
