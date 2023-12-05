const express = require('express');
const pool = require('../db'); // Assuming you have a 'db.js' file setting up your database
const router = express.Router();


router.post('/api/v1/seriallar', async (req, res) => {
    try {
      const { cinema_id, video, title, more_loking,time } = req.body;
      const newseriallar = await pool.query('INSERT INTO seriallar (cinema_id, video, title, more_loking,time) VALUES ($1, $2, $3, $4, $5) RETURNING *', [cinema_id, video, title, more_loking,time]);
      res.json(newseriallar.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  router.get('/api/v1/seriallar', async (req, res) => {
    try {
      const allseriallars = await pool.query('SELECT * FROM seriallar');
      res.json(allseriallars.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  router.get('/api/v1/seriallar/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const seriallar = await pool.query('SELECT * FROM seriallar WHERE id = $1', [id]);
      res.json(seriallar.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  router.put('/api/v1/seriallar/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { cinema_id, video, title, more_loking,time } = req.body;
      const updatedseriallar = await pool.query('UPDATE seriallar SET cinema_id = $1, video = $2, title = $3, more_loking = $4,time=$5 WHERE id = $6 RETURNING *', [cinema_id, video, title, more_loking,time, id]);
      res.json(updatedseriallar.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  router.delete('/api/v1/seriallar/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deletedseriallar = await pool.query('DELETE FROM seriallar WHERE id = $1 RETURNING *', [id]);
      res.json(deletedseriallar.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

module.exports=router
