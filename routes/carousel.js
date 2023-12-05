const express = require('express');
const pool = require('../db'); // Assuming you have a 'db.js' file setting up your database
const router = express.Router();

// Create
router.post('/api/v1/carousel', async (req, res) => {
    try {
      const { cinema_id } = req.body;
      const newEntry = await pool.query(
        'INSERT INTO carousel (cinema_id) VALUES ($1) RETURNING *',
        [cinema_id]
      );
      res.json(newEntry.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });
  
  // Read All
  router.get('/api/v1/carousel', async (req, res) => {
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
        const allEntries = await pool.query('SELECT * FROM carousel');
        var send_data=[]
        for (let i = 0; i < allEntries.rows.length; i++) {
         for (let j = 0; j < rows.length; j++) {
          if(allEntries.rows[i].cinema_id===rows[j].id){
          send_data.push(rows[j])
          }
    }}
      res.json(send_data);
    } catch (err) {
      console.error(err.message);
    }
  });
  
  // Read One
  router.get('/api/v1/carousel/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const entry = await pool.query(
        'SELECT * FROM carousel WHERE id = $1', [id]
      );
      res.json(entry.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });
  
  // Update
  router.put('/api/v1/carousel/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { cinema_id } = req.body;
      
      const updateEntry = await pool.query(
        'UPDATE carousel SET cinema_id = $1 WHERE id = $2 RETURNING *',
        [cinema_id, id]
      );
      res.json(updateEntry.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });
  
  // Delete
  router.delete('/api/v1/carousel/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deleteEntry = await pool.query(
        'DELETE FROM carousel WHERE id = $1 RETURNING *', [id]
      );
      res.json(deleteEntry.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });
  


module.exports=router
