const pool = require("../db");




function isBetweenStartAndEnd(start_day, end_day) {
    const currentTime = new Date();
    const startDate = new Date(start_day);
    const endDate = new Date(end_day);
    return currentTime >= startDate && currentTime <= endDate;
  }


async function getUserByTokenFromHeader(req) {
    try {
      const bearerToken = req.headers.authorization;
      if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
       return false
      }
  
      const token = bearerToken.split(' ')[1];
      
      const query = {
        text: 'SELECT * FROM users WHERE token = $1',
        values: [token],
      };
      const result = await pool.query(query);
      const user = result.rows[0];// Foydalanuvchi ma'lumotlarini olish
      if (!user) {
        return false
      }else{
        return user;
      }
    } catch (error) {
      return false
    }
  }
  module.exports={getUserByTokenFromHeader,isBetweenStartAndEnd}
