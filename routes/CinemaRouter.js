const pool = require("../db.js")
const express = require('express');
const { getUserByTokenFromHeader, isBetweenStartAndEnd } = require("../middleware/Auth.js");
const router = express.Router();

// Create - POST method 
router.post('/api/v1/cinema', async (req, res) => {
  try {
    const { payment, type, year, title, more_loking, time, appearance, ovoz_berdi, country, age_limit, description, language, video, treler, tayming } = req.body;
    const { rows } = await pool.query('INSERT INTO cinema (payment, type, year,  title,  more_loking, time, appearance, ovoz_berdi, country,   age_limit, description, language, video, treler, tayming) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *',
      [payment, type, year, title, more_loking, time, appearance, ovoz_berdi, country, age_limit, description, language, video, treler, tayming]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ... do the same try/catch for every route (get, put, update, delete) ...

router.get('/api/v1/cinema', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM cinema ORDER BY id');
    var image = await pool.query('SELECT * FROM image_cinema ORDER BY id')
    var image_data = image.rows

    var mark = await pool.query('SELECT * FROM mark ORDER BY id')
    var mark_data = mark.rows
    var janr_c = await pool.query('SELECT * FROM janr_cinema ORDER BY id')
    var janr_data_c = janr_c.rows

    var janr = await pool.query('SELECT * FROM janr ORDER BY id')
    var janr_data = janr.rows

    for (let i = 0; i < janr_data_c.length; i++) {
      for (let j = 0; j < janr_data.length; j++) {
        if (janr_data_c[i].janr_id == janr_data[j].id) {
          janr_data_c[i].title = janr_data[j].title
        }
      }

    }

    for (let i = 0; i < rows.length; i++) {
      rows[i].mark = 10
      rows[i].mark_org = false

      rows[i].janrlar = []
      rows[i].images = []
      for (let j = 0; j < image_data.length; j++) {
        if (rows[i].id === image_data[j].cinema_id) {
          rows[i].images.push(image_data[j])
        }

      }
      for (let j = 0; j < janr_data_c.length; j++) {
        if (rows[i].id === janr_data_c[j].cinema_id) {
          rows[i].janrlar.push(janr_data_c[j])
        }

      }
      for (let j = 0; j < mark_data.length; j++) {
        if (rows[i].id === mark_data[j].cinema_id) {
          rows[i].mark = (rows[i].mark + mark_data[j].title) / 2
          rows[i].mark_org = true
        }
      }

    }
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/api/v1/cinema/top', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM cinema ORDER BY more_loking');
    var image = await pool.query('SELECT * FROM image_cinema ORDER BY id')
    var image_data = image.rows

    var mark = await pool.query('SELECT * FROM mark ORDER BY id')
    var mark_data = mark.rows
    var janr_c = await pool.query('SELECT * FROM janr_cinema ORDER BY id')
    var janr_data_c = janr_c.rows

    var janr = await pool.query('SELECT * FROM janr ORDER BY id')
    var janr_data = janr.rows

    for (let i = 0; i < janr_data_c.length; i++) {
      for (let j = 0; j < janr_data.length; j++) {
        if (janr_data_c[i].janr_id == janr_data[j].id) {
          janr_data_c[i].title = janr_data[j].title
        }
      }

    }

    for (let i = 0; i < rows.length; i++) {
      rows[i].mark = 10
      rows[i].mark_org = false

      rows[i].janrlar = []
      rows[i].images = []
      for (let j = 0; j < image_data.length; j++) {
        if (rows[i].id === image_data[j].cinema_id) {
          rows[i].images.push(image_data[j])
        }

      }
      for (let j = 0; j < janr_data_c.length; j++) {
        if (rows[i].id === janr_data_c[j].cinema_id) {
          rows[i].janrlar.push(janr_data_c[j])
        }

      }
      for (let j = 0; j < mark_data.length; j++) {
        if (rows[i].id === mark_data[j].cinema_id) {
          rows[i].mark = (rows[i].mark + mark_data[j].title) / 2
          rows[i].mark_org = true
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
    var data1 = await getUserByTokenFromHeader(req)
    const { rows } = await pool.query('SELECT * FROM cinema WHERE id = $1', [id]);
    const image = await pool.query('SELECT * FROM image_cinema WHERE cinema_id = $1 ORDER BY id', [id]);
    const janr_cinema = await pool.query('SELECT * FROM janr_cinema WHERE cinema_id = $1', [id]);
    const sharx = await pool.query('SELECT * FROM sharx WHERE cinema_id = $1', [id]);
    const users = await pool.query('SELECT email,name,id,ptichka FROM users')
    const janr = await pool.query('SELECT * FROM janr');

    for (let i = 0; i < janr_cinema.rows.length; i++) {
      for (let j = 0; j < janr.rows.length; j++) {
        if (janr_cinema.rows[i].janr_id === janr.rows[j].id) {
          janr_cinema.rows[i].title = janr.rows[i].title
        }
      }
    }
    const marks = await pool.query('SELECT * FROM mark WHERE cinema_id = $1', [id]);
    var mark = 10
    for (let i = 0; i < marks.rows.length; i++) {
      mark = (marks.rows[i].title + mark) / 2
    }
    for (let i = 0; i < sharx.rows.length; i++) {
      for (let j = 0; j < users.rows.length; j++) {
        if (users.rows[j].id == sharx.rows[i].creator) {
          sharx.rows[i].creators = users.rows[j]
        }
      }
    }
    const tarjima_cinema = await pool.query('SELECT * FROM tarjima_cinema WHERE cinema_id = $1', [id]);
    const tarjima = await pool.query('SELECT * FROM tarjima ');


    for (let i = 0; i < tarjima_cinema.rows.length; i++) {
      for (let j = 0; j < tarjima.rows.length; j++) {
        if (tarjima_cinema.rows[i].tarjimon_id === tarjima.rows[j].id) {
          tarjima_cinema.rows[i].title = tarjima.rows[i].full_name
        }
      }
    }

    const seriallar = await pool.query('SELECT * FROM seriallar WHERE cinema_id = $1', [id]);
    const comment = await pool.query('SELECT * FROM comment WHERE cinema_id = $1', [id]);
    pool.query('UPDATE cinema SET  more_loking = $1 WHERE id = $2 RETURNING *', [rows[0].more_loking + 1, id])
    const comment_mark = await pool.query('SELECT * FROM comment_mark ');
    for (let i = 0; i < comment.rows.length; i++) {
      comment.rows[i].top = 0
      comment.rows[i].min = 0
      comment.rows[i].creators = {}
      for (let j = 0; j < comment_mark.rows.length; j++) {
        if (comment.rows[i].id === comment_mark.rows[j].comment_id) {
          if (comment_mark.rows[j].dislike) {
            comment.rows[i].top++
          } else {
            comment.rows[i].min++
          }
        }
      }
      for (let k = 0; k < users.rows.length; k++) {
        if (comment.rows[i].creator == users.rows[k].id) {
          comment.rows[i].creators = users.rows[k]
        }
      }
    }

    var commment_org = []
    for (let i = 0; i < comment.rows.length; i++) {
      if (comment.rows[i].supcomment === 0) {
        commment_org.push(comment.rows[i])
      }
    }

    for (let j = 0; j < commment_org.length; j++) {
      commment_org[j].subcomment = []
      for (let i = 0; i < comment.rows.length; i++) {
        if (commment_org[j].id==comment.rows[i].supcomment) {
          commment_org[j].subcomment.push(comment.rows[i])
        }
      }

    }



    rows[0].tarjima = tarjima_cinema.rows
    rows[0].janr = janr_cinema.rows
    rows[0].marks = marks.rows
    rows[0].allimage = image.rows
    rows[0].mark = mark
    rows[0].seriallar = seriallar.rows
    rows[0].sharx = sharx.rows
    rows[0].comment=commment_org
    if (data1) {
      const paykino = await pool.query('SELECT * FROM paykino WHERE user_id = $1', [data1.id]);
      var bol = false

      for (let i = 0; i < paykino.rows.length; i++) {
        if (isBetweenStartAndEnd(paykino.rows[i].start_day, paykino.rows[i].end_day)) {
          bol = true
        }
      }
      if (bol || rows[0].payment != "Premium") {
        res.json(rows[0])
      } else {
        rows[0].video = false
        res.json(rows[0])
      }
    } else {
      if (rows[0].payment != "Premium") {
        res.json(rows[0])
      } else {
        rows[0].video = false
        res.json(rows[0])
      }
    }



  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.put('/api/v1/cinema/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { payment, type, year, title, more_loking, time, appearance, ovoz_berdi, country, age_limit, description, language, video, treler, tayming } = req.body;
    const { rows } = await pool.query('UPDATE cinema SET payment = $1, type = $2, year = $3, title = $4, more_loking = $5, time = $6, appearance = $7, ovoz_berdi = $8, country = $9, age_limit = $10, description = $11, language = $12, video = $13, treler = $14, tayming = $15, time_update = CURRENT_TIMESTAMP WHERE id = $16 RETURNING *',
      [payment, type, year, title, more_loking, time, appearance, ovoz_berdi, country, age_limit, description, language, video, treler, tayming, id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put('/api/v1/cinema/look/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {looking} = req.body;
    const { rows } = await pool.query('UPDATE cinema SET looking=$1, time_update = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [looking,id]);
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


module.exports = router
