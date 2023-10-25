
const express = require('express');
const pool = require('../db'); // Assuming you have a 'db.js' file setting up your database
const router = express.Router();

// Create
router.post('/api/v1/mark', async (req, res) => {
    try {
      const { cinema_id, title } = req.body;
      const newEntry = await pool.query(
        'INSERT INTO mark (cinema_id, title) VALUES ($1, $2) RETURNING *',
        [cinema_id, title]
      );
      res.json(newEntry.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });
  
  // Read All
  router.get('/api/v1/mark', async (req, res) => {
    try {
      const allEntries = await pool.query('SELECT * FROM mark');
      res.json(allEntries.rows);
    } catch (err) {
      console.error(err.message);
    }
  });
  
  // Read One
  router.get('/api/v1/mark/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const entry = await pool.query('SELECT * FROM mark WHERE id = $1', [id]);
      res.json(entry.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });
  
  // Update
  router.put('/api/v1/mark/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { cinema_id, title } = req.body;
      
      const updateEntry = await pool.query(
        'UPDATE mark SET cinema_id = $1, title = $2 WHERE id = $3 RETURNING *',
        [cinema_id, title, id]
      );
      res.json(updateEntry.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });
  
  // Delete
  router.delete('/api/v1/mark/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deleteEntry = await pool.query(
        'DELETE FROM mark WHERE id = $1 RETURNING *', [id]
      );
      res.json(deleteEntry.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });


module.exports=router
