const express = require('express');
const router = express.Router();
const pool = require('../db'); // PostgreSQL pool connection


// Create 
router.post('/', async (req, res) => {
    try {
      const {user_id,month} = req.body;

      const allPaykino = await pool.query('SELECT * FROM paykino WHERE id = $1', [user_id]);
console.log(allPaykino);

      // start_day ni hozirgi vaqtga sozlaymiz
      const currentDate = new Date();
      const formattedStartDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      // end_day ni start_day dan `month` oydan keyin qo'yamiz
      const formattedEndDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + month, currentDate.getDate());
  
      // Yuborilgan ma'lumotlarni bazaga qo'shish
      const newPaykino = await pool.query(
        'INSERT INTO paykino (user_id, start_day, end_day) VALUES ($1, $2, $3) RETURNING *',
        [user_id, formattedStartDay, formattedEndDay]
      );
  
      res.json(newPaykino.rows[0]);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Serverda xatolik');
    }
  });

// READ - O'qish
router.get('/', async (req, res) => {
  try {
    const allPaykino = await pool.query('SELECT * FROM paykino');
    res.json(allPaykino.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Serverda xatolik');
  }
});

// UPDATE - O'zgartirish
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, start_day, end_day } = req.body;

    const updatePaykino = await pool.query(
      'UPDATE paykino SET user_id = $1, start_day = $2, end_day = $3, time_update = current_timestamp WHERE id = $4 RETURNING *',
      [user_id, start_day, end_day, id]
    );

    res.json(updatePaykino.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Serverda xatolik');
  }
});

// DELETE - O'chirish
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM paykino WHERE id = $1', [id]);

    res.json('Paykino ma\'lumot o\'chirildi');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Serverda xatolik');
  }
});

module.exports = router;