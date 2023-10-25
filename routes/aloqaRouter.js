const express = require('express');
const pool = require('../db'); // Assuming you have a 'db.js' file setting up your database
const router = express.Router();

// Create
router.post('/api/v1/aloqa', async (req, res) => {
    try {
      const { fullname, tema, message, email} = req.body;
      const newAloqa = await pool.query(
        'INSERT INTO aloqa (fullname, tema, message, email) VALUES ($1, $2, $3, $4) RETURNING *',
        [fullname, tema, message, email]
      );
      res.json(newAloqa.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });
  
  // Read All
  router.get('/api/v1/aloqa', async (req, res) => {
    try {
      const allAloqa = await pool.query('SELECT * FROM aloqa');
      res.json(allAloqa.rows);
    } catch (err) {
      console.error(err.message);
    }
  });
  
  // Read One
  router.get('/api/v1/aloqa/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const aloqa = await pool.query(
        'SELECT * FROM aloqa WHERE id = $1', [id]
      );
      res.json(aloqa.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });
  
  // Update
  router.put('/api/v1/aloqa/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { fullname, tema, message, email} = req.body;
      
      const updateAloqa = await pool.query(
        'UPDATE aloqa SET fullname = $1, tema = $2, message = $3, email = $4 WHERE id = $5 RETURNING *', [fullname, tema, message, email, id]
      );
      res.json(updateAloqa.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });
  
  // Delete 
  router.delete('/api/v1/aloqa/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deleteAloqa = await pool.query(
        'DELETE FROM aloqa WHERE id = $1 RETURNING *', [id]
      );
      res.json(deleteAloqa.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });

module.exports=router
