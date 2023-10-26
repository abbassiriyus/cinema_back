const pool= require("../db.js")
const express=require('express')
const router = express.Router();



// CREATE - Yaratish
router.post('/seriallar', (req, res) => {
    const serialData = req.body;
    db.one(`
      INSERT INTO seriallar (video, cinema_id, title, time)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `, [serialData.video, serialData.cinema_id, serialData.title, serialData.time])
      .then((result) => {
        res.status(201).json({ message: 'Serial yaratildi', id: result.id });
      })
      .catch((error) => {
        res.status(500).json({ error: 'Serial yaratishda xatolik yuz berdi' });
      });
  });
  
  // READ - O'qish
  router.get('/seriallar', (req, res) => {
    db.any('SELECT * FROM seriallar')
      .then((seriallar) => {
        res.status(200).json(seriallar);
      })
      .catch((error) => {
        res.status(500).json({ error: 'Seriallarni olishda xatolik yuz berdi' });
      });
  });
  
  router.get('/seriallar/:id', (req, res) => {
    const serialId = req.params.id;
    db.one('SELECT * FROM seriallar WHERE id = $1', serialId)
      .then((serial) => {
        res.status(200).json(serial);
      })
      .catch((error) => {
        res.status(404).json({ error: 'Bunday ID bilan serial topilmadi' });
      });
  });
  
  // UPDATE - Yangilash
  router.put('/seriallar/:id', (req, res) => {
    const serialId = req.params.id;
    const updateData = req.body;
    db.none(`
      UPDATE seriallar
      SET
        video = $1,
        cinema_id = $2,
        title = $3,
        time = $4,
        time_update = current_timestamp
      WHERE id = $5
    `, [updateData.video, updateData.cinema_id, updateData.title, updateData.time, serialId])
      .then(() => {
        res.status(200).json({ message: 'Serial yangilandi' });
      })
      .catch((error) => {
        res.status(500).json({ error: 'Serialni yangilashda xatolik yuz berdi' });
      });
  });
  
  // DELETE - O'chirish
  router.delete('/seriallar/:id', (req, res) => {
    const serialId = req.params.id;
    db.none('DELETE FROM seriallar WHERE id = $1', serialId)
      .then(() => {
        res.status(200).json({ message: 'Serial o\'chirildi' });
      })
      .catch((error) => {
        res.status(500).json({ error: 'Serialni o\'chirishda xatolik yuz berdi' });
      });
  });

  module.exports=router