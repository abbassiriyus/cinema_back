const express = require('express');
const pool = require('../db'); // Assuming you have a 'db.js' file setting up your database
const router = express.Router();


router.post('/api/v1/comment', async (req, res) => {
    try {
      const { cinema_id, supcomment, description, creator } = req.body;
      const newComment = await pool.query('INSERT INTO comment (cinema_id, supcomment, description, creator) VALUES ($1, $2, $3, $4) RETURNING *', [cinema_id, supcomment, description, creator]);
      res.json(newComment.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  router.get('/api/v1/comment', async (req, res) => {
    try {
      const allComments = await pool.query('SELECT * FROM comment');
      res.json(allComments.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  router.get('/api/v1/comment/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const comment = await pool.query('SELECT * FROM comment WHERE id = $1', [id]);
      res.json(comment.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  router.put('/api/v1/comment/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { cinema_id, supcomment, description, creator } = req.body;
      const updatedComment = await pool.query('UPDATE comment SET cinema_id = $1, supcomment = $2, description = $3, creator = $4 WHERE id = $5 RETURNING *', [cinema_id, supcomment, description, creator, id]);
      res.json(updatedComment.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  router.delete('/api/v1/comment/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deletedComment = await pool.query('DELETE FROM comment WHERE id = $1 RETURNING *', [id]);
      res.json(deletedComment.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

module.exports=router
