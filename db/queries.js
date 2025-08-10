const pool = require("./pool");

async function signUpUser ({userInfo},hashedpw){
    try {await pool.query(`INSERT INTO users (first_name,last_name,username,password_hash) 
    VALUES ($1,$2,$3,$4)`, [
    userInfo.firstName,
    userInfo.lastName,
    userInfo.username,
    hashedpw
  ])} catch (err) {
    console.error(err)
    throw new Error('Unable to create user.')
  }
   
}


async function updateAdminStatus(userId) {
    try {
        const { rowCount } = await pool.query(`
            UPDATE users
            SET is_admin = true
            WHERE id = $1
        `, [userId]);

        if (rowCount === 0) {
            throw new Error('User not found');
        }
    } catch (err) {
        console.error(err);
        throw new Error(`Unable to update status: ${err.message}`);
    }
}

async function createMessage (subject,message,user_id){
    
    await pool.query(`INSERT INTO messages (subject,body,user_id) 
    VALUES ($1,$2,$3)`, [
    subject,
    message,
    user_id,
    
  ])
}

async function showAllMessages() {
  const { rows } = await pool.query(`
    SELECT 
      m.id,
      m.subject,
      m.body,
      m.created_at,
      u.id        AS user_id,
      u.username  AS author_username
    FROM messages m
    JOIN users u ON u.id = m.user_id
    ORDER BY m.created_at DESC
  `);
  return rows;
}

async function deleteMessage(author_id,message_id) {
    try {
          await pool.query(`
    DELETE FROM messages
    WHERE user_id = ($1)
    AND id = ($2);
  `);
    }
    catch(err) {
        console.error('Error When Deleting message message:', err)
        throw new Error('Permission to delete message denied.')
    }
  
}

module.exports = {
    signUpUser
}
