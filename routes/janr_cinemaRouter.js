const express = require('express');
const pool = require('../db'); // Assuming you have a 'db.js' file setting up your database
const router = express.Router();

// Create
router.post('/api/v1/janr_cinema', async (req, res) => {
    try {
      const { cinema_id, janr_id } = req.body;
      const newEntry = await pool.query(
        'INSERT INTO janr_cinema (cinema_id, janr_id) VALUES ($1, $2) RETURNING *',
        [cinema_id, janr_id]
      );
      res.json(newEntry.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });
  
  // Read All
  router.get('/api/v1/janr_cinema', async (req, res) => {
    try {
      const allEntries = await pool.query('SELECT * FROM janr_cinema');
      res.json(allEntries.rows);
    } catch (err) {
      console.error(err.message);
    }
  });
  
  // Read One
  router.get('/api/v1/janr_cinema/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const entry = await pool.query(
        'SELECT * FROM janr_cinema WHERE id = $1', [id]
      );
      res.json(entry.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });
  
  // Update
  router.put('/api/v1/janr_cinema/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { cinema_id, janr_id} = req.body;
      
      const updateEntry = await pool.query(
        'UPDATE janr_cinema SET cinema_id = $1, janr_id = $2 WHERE id = $3 RETURNING *',
         [cinema_id, janr_id, id]
      );
      res.json(updateEntry.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });
  
  // Delete
  router.delete('/api/v1/janr_cinema/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deleteEntry = await pool.query(
        'DELETE FROM janr_cinema WHERE id = $1 RETURNING *', [id]
      );
      res.json(deleteEntry.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });



module.exports=router