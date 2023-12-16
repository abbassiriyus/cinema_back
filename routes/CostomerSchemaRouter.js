require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require("../db.js");
const { isBetweenStartAndEnd } = require('../middleware/Auth.js');

const router = express.Router();
// router.use(bodyParser.json());

const SECRET = process.env.TOKEN_SECRET;

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // add some basic validation
    if (!name || !email || !password) throw new Error('All fields are required.');

    const hashedPassword = password
    const user = {
      name: name,
      email: email,
      password: hashedPassword
    }
    const jwtToken = jwt.sign(user, SECRET);

    var { rows }=await pool.query('INSERT INTO users (email,password,name,token) VALUES ($1, $2, $3, $4 ) RETURNING *', [email, hashedPassword, name, jwtToken]);
    console.log(rows);
    res.json({ token: jwtToken, data:rows});
    // const newEntry = await pool.query(
    //   'INSERT INTO janr (cinema_id, title) VALUES ($1, $2) RETURNING *',
    //   [cinema_id, title]
    // );
    // res.json(newEntry.rows[0]);
  } catch (err) {
    // set status code to 400 for client errors and provide error message
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // add some basic validation
    if (!email || !password) throw new Error('Email and password are required.');

    // Get user from the database
    const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userRes.rows[0];

    // Check if User exists
    if (!user) {
      return res.status(400).json({ error: 'User does not exist.' })
    }

    // Compare passwords
    // const passwordMatch = await bcrypt.compare(password,);
    if (password != user.password) {
      return res.status(400).json({ error: 'Incorrect password.' });
    }

    // Create token with API secret
    const jwtToken = jwt.sign({ id: user.id, name: user.name, email: email }, SECRET, { expiresIn: '1h' });
    pool.query('UPDATE users SET token=$1 WHERE id = $2', [jwtToken, user.id])

    // Send back the token
    res.json({ token: jwtToken, message: 'You have successfully logged in!' });

  } catch (err) {
    // set status code to 400 for client errors and provide error message
    res.status(400).json({ error: err.message });
  }
});
router.get('/user', async (req, res) => {
  const token = req.header('authorization').split(' ')[1];
  console.log(token);
  if (!token) {
    return res.status(403).json({ error: 'Token is required.' });
  }

  try {
    // Token ni tekshiramiz va uning ichidagi ma'lumotlarni olamiz
    const userData = jwt.verify(token, SECRET);

    // user id orqali user ma'lumotlarni bazadan olish
    const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [userData.id]);
    const user = userRes.rows[0];

    // Agar foydalanuvchi topilmadi bo'lsa, xatolik qaytariladi
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // foydalanuvchi ma'lumotlarini qaytarish
    res.json(user);
  } catch (err) {
    // Token tekshiruvi yoki bazadan foydalanuvchini olishda xato bo'lsa, xabo qaytarish
    res.status(400).json({ error: err.message });
  }
});
router.delete('/user', async (req, res) => {
  const token = req.header('authorization').split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'Token is required.' });
  }

  try {
    const userData = jwt.verify(token, SECRET);

    // user id orqali userni bazadan o'chirish
    const deleteRes = await pool.query('DELETE FROM users WHERE id = $1', [userData.id]);

    // Agar foydalanuvchi topilmadi bo'lsa, yani uni o'chirish amali bajarilmagan bo'lsa,
    // xatolik qaytariladi
    if (deleteRes.rowCount === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // O'chirish amali muvaffaqiyatli amalga oshganida, ishning tugallanganini bildirgich msg qaytaradi.
    res.json({ message: 'User has been deleted successfully.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// PUT /user endpoynti
router.put('/user', async (req, res) => {
  // token ni headerdan olamiz
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  if (!token) return res.status(401).send('Access Denied. No token provided.');

  let userId; // user id saqlanadigan o'zgaruvchi
  try {
    // token topildi endi uni verify qilamiz
    const decoded = jwt.verify(token, 'YourSecretKey');
    userId = decoded.id;
  } catch (ex) {
    // token verification fail bo'larsa xatolik qaytariladi
    return res.status(400).send('Invalid token.');
  }

  try {
    // Userning id si bo'yicha yangilash amaliyoti
    // "User" modelni va "YourSecretKey" ni o'z proyektingizga moslashtiring
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('The user with the given ID was not found.');

    // Yangilanmagan ma'lumot uchun standartni saqlash
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    // va hokazo...

    await user.save();
    res.send(user);
  } catch (err) {
    // yangilash amalida xatolik yuzaga kelsa
    console.error('Something went wrong during the update process', err);
    res.status(500).send('Something went wrong during the update process.');
  }
});
router.post('/users', (req, res) => {
  pool.query('INSERT INTO users(email, password, ptichka, name, superadmin) VALUES($1, $2, $3, $4, $5)', [req.body.email, req.body.password, req.body.ptichka, req.body.name, req.body.superadmin])
    .then(() => {
      res.status(200).json({
        status: 'success',
        message: 'Inserted one user'
      });
    })
    .catch((error) => {
      return next(error);
    });
});
// Read -> GET request
router.get('/users', (req, res) => {
  pool.query('SELECT * FROM users')
    .then((data) => {
      pool.query('SELECT * FROM paykino').then(ult => {
        for (let i = 0; i < data.rows.length; i++) {
          data.rows[i].pay = false
          for (let j = 0; j < ult.rows.length; j++) {
            if (data.rows[i].id === ult.rows[j].user_id && isBetweenStartAndEnd(ult.rows[j].start_day, ult.rows[j].end_day)) {
              data.rows[i].pay = true
            }

          }
        }
        res.status(200).send(data.rows)
      }).catch(err => {
        res.status(400).send(err.message)

      })
      //  res.status(200).json(data.rows);
    })
    .catch((error) => {
      res.status(400).send("error2")
    });
});

// Update -> PUT request
router.put('/users/:id', (req, res) => {
  pool.query('UPDATE users SET email=$1, familiya=$2,  name=$3, superadmin=$4 WHERE id = $5',
    [req.body.email, req.body.familiya,req.body.name, req.body.superadmin, parseInt(req.params.id)])
    .then(() => {
      res.status(200).json({
        status: 'success',
        message: 'Updated user'
      });
    })
    .catch((error) => {
      return next(error);
    })
});

router.put('/user_one/:id', (req, res) => {
  pool.query('UPDATE users SET email=$1,name=$2,familiya=$3 WHERE id = $4',
    [req.body.email, req.body.name, req.body.familiya, parseInt(req.params.id)])
    .then(() => {
      res.status(200).json({
        status: 'success',
        message: 'Updated user'
      });
    })
    .catch((error) => {
      return next(error);
    })
});


router.put('/reset/:id', async (req, res) => {

  var { old_password, password, repit_password } = req.body
  const user_id = req.params.id

  const result1 = await pool.query(
    'SELECT * FROM users WHERE id = $1 AND password = $2',
    [user_id, old_password]
  );
  if (result1.rows.length == 1 && repit_password == password) {
    pool.query('UPDATE users SET password=$1 WHERE id = $2',
      [req.body.password, user_id])
      .then(() => {
        res.status(200).json({
          status: 'success',
          message: 'Updated user'
        });
      })
      .catch((error) => {
        res.status(400).send(error.message)
      })
  } else {
    res.status(400).send("not update")
  }

});

// Delete -> DELETE request
// router.delete('/users/:id', (req, res) => {
//     pool.query('DELETE FROM users WHERE id = $1', parseInt(req.params.id))
//      .then((result) => {
//          res.status(200).json({
//              status: 'success',
//              message: `Removed ${result.rowCount} user`
//          });
//      })
//      .catch((error) => {
//         res.status(500).json({error:error.message})
//      });
// });
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put('/panu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { pan } = req.body;

    const updateEntry = await pool.query(
      'UPDATE users SET pan = $1 WHERE id = $2 RETURNING *',
      [pan, id]
    );
    res.json(updateEntry.rows[0]);
  } catch (err) {
    res.status(400).send('error')
  }
});
module.exports = router