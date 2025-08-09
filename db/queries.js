const pool = require("./pool");

async function signUpUser (user,hashedpw){

    await pool.query(`INSERT INTO user (first_name,last_name,username,password_hash) 
    VALUES ($1,$2,$3,$4,$5)`, [
    user.firstName,
    user.lastName,
    user.username,
    hashedpw
  ])
}