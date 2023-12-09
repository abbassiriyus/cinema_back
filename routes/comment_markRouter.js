const express = require('express');
const pool = require('../db'); // Assuming you have a 'db.js' file setting up your database
const router = express.Router();


  router.post('/api/v1/comment_mark', async (req, res) => {
    try {
      const { dislike, comment_id,creator } = req.body;
      const newMark = await pool.query('INSERT INTO comment_mark (dislike, comment_id,creator) VALUES ($1, $2, $3) RETURNING *', [dislike, comment_id,creator]);
      res.json(newMark.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
   });
  
  router.get('/api/v1/comment_mark', async (req, res) => {
    try {
      const allMarks = await pool.query('SELECT * FROM comment_mark');
      res.json(allMarks.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  router.get('/api/v1/comment_mark/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const mark = await pool.query('SELECT * FROM comment_mark WHERE id = $1', [id]);
      res.json(mark.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  router.put('/api/v1/comment_mark/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { dislike, comment_id } = req.body;
      const updatedMark = await pool.query('UPDATE comment_mark SET dislike = $1, comment_id = $2 WHERE id = $3 RETURNING *', [dislike, comment_id, id]);
      res.json(updatedMark.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  router.delete('/api/v1/comment_mark/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deletedMark = await pool.query('DELETE FROM comment_mark WHERE id = $1 RETURNING *', [id]);
      res.json(deletedMark.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

module.exports=router