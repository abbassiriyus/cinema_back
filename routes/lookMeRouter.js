const express = require('express');
const router = express.Router();
const pool = require('../db'); // PostgreSQL ma'lumotlar omboriga ulanish
const { isBetweenStartAndEnd } =require("../middleware/Auth")
// Ma'lumotlarni olish
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM look_me');
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Serverda xatolik yuz berdi' });
  }
});

// user ko`rgan kinolarni chiqaradi
   router.get('/:user_id', async (req, res) => {
    const { user_id } = req.params;
    try {
    const result1 = await pool.query(
      'SELECT * FROM look_me WHERE user_id = $1 ORDER BY time_update DESC',
      [user_id]
    );
    const sharx = await pool.query(
      'SELECT * FROM sharx WHERE creator = $1 ORDER BY time_update DESC',
      [user_id]
    );
    const paykino = await pool.query(
      'SELECT * FROM paykino WHERE user_id = $1 ORDER BY time_update DESC',
      [user_id]
    );
    const fikr = await pool.query(
      'SELECT * FROM comment WHERE creator = $1 ORDER BY time_update DESC',
      [user_id]
    );
    const result2 = await pool.query('SELECT * FROM cinema');
    const result3 = await pool.query('SELECT * FROM mark');
    for (let i = 0; i < result2.rows.length; i++) {
      result2.rows[i].mark=10
    for (let j = 0; j < result3.rows.length; j++) {
if(result2.rows[i].id){
  result2.rows[i].mark=(result2.rows[i].mark+result3.rows[j].title)/2
}        
    }
    } 
for (let i = 0; i < result1.rows.length; i++) {
for (let j = 0; j < result2.rows.length; j++) {
if(result1.rows[i].cinema_id==result2.rows[j].id){
result1.rows[i].title=result2.rows[j].title
result1.rows[i].appearance=result2.rows[j].appearance
result1.rows[i].mark=result2.rows[j].mark
}
}}
for (let i = 0; i < sharx.rows.length; i++) {
  for (let j = 0; j < result2.rows.length; j++) {
  if(sharx.rows[i].cinema_id==result2.rows[j].id){
  sharx.rows[i].titlea=result2.rows[j].title
  sharx.rows[i].appearance=result2.rows[j].appearance
  sharx.rows[i].mark=result2.rows[j].mark
  }
  }}

    res.json({all:result1.rows,sharx:sharx.rows,fikr:fikr.rows.length,pay:isBetweenStartAndEnd()});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Serverda xatolik yuz berdi' });
  }
});

// Ma'lumot qo'shish
router.post('/', async (req, res) => {
  const { cinema_id, user_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO look_me (cinema_id, user_id) VALUES ($1, $2) RETURNING *',
      [cinema_id, user_id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
if(error.message.includes('look_me_cinema_id_user_id_key')){
// res.status(200).send("update")
const look_me = await pool.query('SELECT id FROM look_me WHERE user_id = $1 AND cinema_id = $2', [user_id, cinema_id])
const result = await pool.query(
  'UPDATE look_me SET cinema_id = $1, user_id = $2, time_update = current_timestamp WHERE id = $3 RETURNING *',
  [cinema_id, user_id, look_me.rows[0].id]
);
res.status(200).send("update")
}else{
res.status(500).json({ error: error.message });
}  
  }
});

// Ma'lumotni yangilash
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { cinema_id, user_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE look_me SET cinema_id = $1, user_id = $2, time_update = current_timestamp WHERE id = $3 RETURNING *',
      [cinema_id, user_id, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Serverda xatolik yuz berdi' });
  }
});

// Ma'lumotni o'chirish
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM look_me WHERE id = $1', [id]);
    res.json({ message: 'Ma\'lumot muvaffaqiyatli o\'chirildi' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Serverda xatolik yuz berdi' });
  }
});

module.exports = router;