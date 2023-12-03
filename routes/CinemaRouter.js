const pool= require("../db.js")
const express=require('express')
const router = express.Router();

// Create - POST method 
router.post('/api/v1/cinema',  async (req, res) => {
    try {
      const { payment, type, year, title, more_loking, time, appearance, ovoz_berdi, country, age_limit, description, language, video, treler, Tayming } = req.body;
      const { rows } = await pool.query('INSERT INTO cinema (payment, type, year,  title,  more_loking, time, appearance, ovoz_berdi, country,   age_limit, description, language, video, treler, Tayming) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *', 
      [payment, type, year, title, more_loking, time, appearance, ovoz_berdi, country, age_limit, description, language, video, treler, Tayming]);
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // ... do the same try/catch for every route (get, put, update, delete) ...
  
  router.get('/api/v1/cinema', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM cinema ORDER BY id');
    var image=await pool.query('SELECT * FROM image_cinema ORDER BY id')
    var image_data=image.rows

    var mark=await pool.query('SELECT * FROM mark ORDER BY id')
    var mark_data=mark.rows
    var janr_c=await pool.query('SELECT * FROM janr_cinema ORDER BY id')
    var janr_data_c=janr_c.rows

    var janr=await pool.query('SELECT * FROM janr ORDER BY id')
    var janr_data=janr.rows

    for (let i = 0; i < janr_data_c.length; i++) {
for (let j = 0; j < janr_data.length; j++) {
if(janr_data_c[i].janr_id==janr_data[j].id){
  janr_data_c[i].title=janr_data[j].title
} }
      
    }

for (let i = 0; i < rows.length; i++) {
  rows[i].mark=10
  rows[i].mark_org=false

  rows[i].janrlar=[]
  rows[i].images=[]
 for (let j = 0; j < image_data.length; j++) {
 if(rows[i].id===image_data[j].cinema_id){
rows[i].images.push(image_data[j])
 }

 }
 for (let j = 0; j < janr_data_c.length; j++) {
  if(rows[i].id===janr_data_c[j].cinema_id){
 rows[i].janrlar.push(janr_data_c[j])
  }
 
  }
 for (let j = 0; j < mark_data.length; j++) {
  if(rows[i].id===mark_data[j].cinema_id){
    rows[i].mark=(rows[i].mark+mark_data[j].title)/2
    rows[i].mark_org=true
  }
  }
  
}
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  router.get('/api/v1/cinema/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { rows } = await pool.query('SELECT * FROM cinema WHERE id = $1', [id]);
      const image = await pool.query('SELECT * FROM image_cinema WHERE cinema_id = $1', [id]);
      const data = await pool.query('UPDATE cinema SET  more_loking = $1 WHERE id = $2 RETURNING *',[rows[0].more_loking+1, id]) 
      rows[0].allimage=image.rows
      res.json(rows[0])
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  router.put('/api/v1/cinema/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { payment, type, year, title, more_loking, time, appearance, ovoz_berdi, country, age_limit, description, language, video, treler, Tayming } = req.body;
      const { rows } = await pool.query('UPDATE cinema SET payment = $1, type = $2, year = $3, title = $4, more_loking = $5, time = $6, appearance = $7, ovoz_berdi = $8, country = $9, age_limit = $10, description = $11, language = $12, video = $13, treler = $14, Tayming = $15, time_update = CURRENT_TIMESTAMP WHERE id = $16 RETURNING *', 
      [payment, type, year, title, more_loking, time, appearance, ovoz_berdi, country, age_limit, description, language, video, treler, Tayming, id]);
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
    
  router.delete('/api/v1/cinema/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { rows } = await pool.query('DELETE FROM cinema WHERE id = $1 RETURNING *', [id]);
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


  module.exports=router
