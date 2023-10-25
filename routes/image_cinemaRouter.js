const express = require('express');
const pool = require('../db'); // Assuming you have a 'db.js' file setting up your database
const router = express.Router();

router.post('/api/v1/image_cinema', async (req, res) => {
  try {
    const { cinema_id, image } = req.body;
    const newImage = await pool.query('INSERT INTO image_cinema (cinema_id, image) VALUES ($1, $2) RETURNING *', [cinema_id, image]);
    res.json(newImage.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/api/v1/image_cinema', async (req, res) => {
  try {
    const allImages = await pool.query('SELECT * FROM image_cinema');
    res.json(allImages.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/api/v1/image_cinema/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const image = await pool.query('SELECT * FROM image_cinema WHERE id = $1', [id]);
    res.json(image.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/api/v1/image_cinema/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { cinema_id, image } = req.body;
    const updatedImage = await pool.query('UPDATE image_cinema SET cinema_id = $1, image = $2 WHERE id = $3 RETURNING *', [cinema_id, image, id]);
    res.json(updatedImage.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/api/v1/image_cinema/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedImage = await pool.query('DELETE FROM image_cinema WHERE id = $1 RETURNING *', [id]);
    res.json(deletedImage.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports=router
