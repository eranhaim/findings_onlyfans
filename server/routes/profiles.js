const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

router.get('/', async (req, res) => {
  try {
    const { category, search, location, page = 1, limit = 20 } = req.query;
    const query = {};

    if (category && category !== 'all') {
      if (category === 'free') {
        query.isFree = true;
      } else if (category === 'new') {
        query.isNewModel = true;
      } else if (category !== 'near') {
        query.category = category;
      }
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { 'bio.en': { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let sortOption = { likes: -1 };
    if (category === 'new') sortOption = { createdAt: -1 };
    if (category === 'popular') sortOption = { likes: -1 };
    if (category === 'top') sortOption = { likes: -1 };

    const [profiles, total] = await Promise.all([
      Profile.find(query).sort(sortOption).skip(skip).limit(parseInt(limit)),
      Profile.countDocuments(query),
    ]);

    res.json({
      profiles,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
