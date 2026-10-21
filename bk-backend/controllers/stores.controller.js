import db from '../db/database.js';

function haversine(lat1, lng1, lat2, lng2) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function normalizeStore(row, distance = null) {
  return {
    ...row,
    is_open_now: Boolean(row.is_open_now),
    features: JSON.parse(row.features || '[]'),
    distance_miles: distance === null ? null : Number(distance.toFixed(2)),
  };
}

export function getStores(req, res) {
  const { search, feature, open_now } = req.query;
  const rows = db.prepare('SELECT * FROM stores ORDER BY name ASC').all();

  let stores = rows.map((row) => normalizeStore(row));

  if (search) {
    const needle = search.toLowerCase();
    stores = stores.filter((store) =>
      [store.name, store.address, store.city].some((value) => value.toLowerCase().includes(needle))
    );
  }

  if (feature) {
    stores = stores.filter((store) => store.features.includes(feature));
  }

  if (open_now === 'true') {
    stores = stores.filter((store) => store.is_open_now);
  }

  res.json({ success: true, count: stores.length, stores });
}

export function getStoreById(req, res) {
  const store = db.prepare('SELECT * FROM stores WHERE id = ?').get(req.params.id);
  if (!store) {
    return res.status(404).json({ error: 'Store not found' });
  }
  res.json({ success: true, store: normalizeStore(store) });
}

export function getNearbyStores(req, res) {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const radiusMiles = Number(req.query.radius_miles || 10);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return res.status(400).json({ error: 'lat and lng query params are required' });
  }

  const rows = db.prepare('SELECT * FROM stores').all();
  const stores = rows
    .map((row) => {
      const distance = haversine(lat, lng, row.lat, row.lng);
      return normalizeStore(row, distance);
    })
    .filter((store) => store.distance_miles <= radiusMiles)
    .sort((a, b) => a.distance_miles - b.distance_miles);

  res.json({ success: true, count: stores.length, stores });
}
