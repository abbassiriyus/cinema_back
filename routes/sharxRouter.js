const express = require('express');
const pool = require('../db'); // Assuming you have a 'db.js' file setting up your database
const router = express.Router();
// Create
router.post('/api/v1/sharx', async (req, res) => {
    try {
      const { cinema_id, description, rating, title, creator } = req.body;
      const newSharx = await pool.query(
        'INSERT INTO sharx (cinema_id, description, rating, title, creator) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [cinema_id, description, rating, title, creator]
      );
      res.status(200).json(newSharx.rows[0]);
    } catch (err) {
    res.status(400).send(err.message)
    }
  });
  
  // Read All
  router.get('/api/v1/sharx', async (req, res) => {
    try {
      const allSharx = await pool.query('SELECT * FROM sharx');
      res.json(allSharx.rows);
    } catch (err) {
    res.status(400).send(err.message)
    }
  });
  
  // Read One
  router.get('/api/v1/sharx/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const sharx = await pool.query('SELECT * FROM sharx WHERE id = $1', [id]);
      res.json(sharx.rows[0]);
    } catch (err) {
    res.status(400).send(err.message)
    }
  });
  
  // Update
  router.put('/api/v1/sharx/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { cinema_id, description, rating, title, creator } = req.body;
      const updateSharx = await pool.query(
        'UPDATE sharx SET cinema_id = $1, description = $2, rating = $3, title = $4, creator = $5 WHERE id = $6 RETURNING *',
        [cinema_id, description, rating, title, creator, id]
      );
  
      res.json(updateSharx.rows[0]);
    } catch (err) {
    res.status(400).send(err.message)
    }
  });
  
  // Delete
  router.delete('/api/v1/sharx/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deleteSharx = await pool.query('DELETE FROM sharx WHERE id = $1 RETURNING *', [id]);
      res.json(deleteSharx.rows[0]);
    } catch (err) {
    res.status(400).send(err.message)
    }
  });
  




module.exports=router
