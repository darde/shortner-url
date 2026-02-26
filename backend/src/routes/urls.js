const express = require('express');
const router = express.Router();
const { randomBytes } = require('crypto');
const prisma = require('../db');

function isValidUrl(str) {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function generateId(length = 7) {
  return randomBytes(length).toString('base64url').slice(0, length);
}

// POST /api/shorten
router.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: 'originalUrl is required.' });
  }

  if (!isValidUrl(originalUrl)) {
    return res.status(400).json({ error: 'originalUrl must be a valid http/https URL.' });
  }

  // Retry on the rare chance of a collision
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const url = await prisma.url.create({
        data: { alias: generateId(), originalUrl },
      });
      return res.status(201).json(url);
    } catch (err) {
      if (err.code !== 'P2002') {
        return res.status(500).json({ error: 'Server error. Please try again.' });
      }
    }
  }

  return res.status(500).json({ error: 'Could not generate a unique ID. Please try again.' });
});

// GET /api/urls
router.get('/urls', async (req, res) => {
  try {
    const urls = await prisma.url.findMany({ orderBy: { createdAt: 'desc' } });
    return res.json(urls);
  } catch {
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// DELETE /api/urls/:alias
router.delete('/urls/:alias', async (req, res) => {
  try {
    await prisma.url.delete({ where: { alias: req.params.alias } });
    return res.json({ message: 'Deleted successfully.' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Alias not found.' });
    }
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

module.exports = router;
