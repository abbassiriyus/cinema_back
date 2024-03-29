const express = require('express');
const pool = require('../db'); // Assuming you have a 'db.js' file setting up your database
const router = express.Router();



// Create
router.post('/api/v1/janr', async (req, res) => {
    try {
      const {title } = req.body;
      const newEntry = await pool.query(
        'INSERT INTO janr ( title) VALUES ($1) RETURNING *',
        [title]
      );
      res.json(newEntry.rows[0]);
    } catch (err) {
      res
      console.error(err.message);
    }
  });
  
  // Read All
  router.get('/api/v1/janr', async (req, res) => {
    try {
      const allEntries = await pool.query('SELECT * FROM janr');
      res.json(allEntries.rows);
    } catch (err) {
      console.error(err.message);
    }
  });
  
  // Read One
  router.get('/api/v1/janr/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const entry = await pool.query(
        'SELECT * FROM janr WHERE id = $1', [id]
      );
      res.json(entry.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });
  
  // Update
  router.put('/api/v1/janr/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { title } = req.body;
      
      const updateEntry = await pool.query(
        'UPDATE janr SET title = $1 WHERE id = $2 RETURNING *',
         [title, id]
      );
      res.json(updateEntry.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });
  
  // Delete
  router.delete('/api/v1/janr/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deleteEntry = await pool.query(
        'DELETE FROM janr WHERE id = $1 RETURNING *', [id]
      );
      res.json(deleteEntry.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });




module.exports=router
