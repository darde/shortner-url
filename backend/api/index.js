require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const prisma = require('../src/db');
const urlRoutes = require('../src/routes/urls');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', urlRoutes);

// Redirect route — must come after /api routes
app.get('/:alias([a-zA-Z0-9_-]+)', async (req, res) => {
  try {
    const record = await prisma.url.update({
      where: { alias: req.params.alias },
      data: { clicks: { increment: 1 } },
    });
    return res.redirect(301, record.originalUrl);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Short URL not found.' });
    }
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
