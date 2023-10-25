const express = require('express');
const pool = require('../db'); // Assuming you have a 'db.js' file setting up your database
const router = express.Router();

// Create
router.post('/api/v1/tarjima', async (req, res) => {
    try {
      const { full_name } = req.body;
      const newEntry = await pool.query(
        'INSERT INTO tarjima (full_name) VALUES ($1) RETURNING *',
        [full_name]
      );
      res.json(newEntry.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });
  
  // Read All
  router.get('/api/v1/tarjima', async (req, res) => {
    try {
      const allEntries = await pool.query('SELECT * FROM tarjima');
      res.json(allEntries.rows);
    } catch (err) {
      console.error(err.message);
    }
  });
  
  // Read One
  router.get('/api/v1/tarjima/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const entry = await pool.query(
        'SELECT * FROM tarjima WHERE id = $1', [id]
      );
      res.json(entry.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });
  
  // Update
  router.put('/api/v1/tarjima/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { full_name } = req.body;
      
      const updateEntry = await pool.query(
        'UPDATE tarjima SET full_name = $1 WHERE id = $2 RETURNING *',
        [full_name, id]
      );
      res.json(updateEntry.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });
  
  // Delete
  router.delete('/api/v1/tarjima/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deleteEntry = await pool.query(
        'DELETE FROM tarjima WHERE id = $1 RETURNING *', [id]
      );
      res.json(deleteEntry.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });
  


module.exports=router
