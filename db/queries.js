const pool = require("./pool");

// SIGNUP
async function signUpUser({ userInfo }, hashedpw) {
  await pool.query(
    `INSERT INTO users (first_name, last_name, username, password_hash)
     VALUES ($1, $2, $3, $4)`,
    [userInfo.firstName, userInfo.lastName, userInfo.username, hashedpw]
  );
}

// LOGIN HELPERS
async function findByUsername(username) {
  const { rows } = await pool.query(
    `SELECT id, username, password_hash, first_name, last_name, is_admin, is_member
     FROM users WHERE username = $1`,
    [username]
  );
  return rows[0] || null;
}

async function findById(id) {
  const { rows } = await pool.query(
    `SELECT id, username, first_name, last_name, is_admin, is_member
     FROM users WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

async function selectUser(username) {
  const { rows } = await pool.query(
    `SELECT username, password_hash FROM users WHERE username = $1`,
    [username]
  );
  return rows[0] || null;
}

// ADMIN
async function grantAdminAccess(userId) {
  await pool.query(`UPDATE users SET is_admin = true WHERE id = $1`, [userId]);
}

// MESSAGES
async function getAllMessages() {
  const { rows } = await pool.query(`
    SELECT m.id, m.subject, m.body, m.created_at,
           u.id AS author_id, u.username
    FROM messages m
    JOIN users u ON u.id = m.user_id
    ORDER BY m.created_at DESC
  `);
  return rows;
}

async function createMessage({ userId, subject, body }) {
  await pool.query(
    `INSERT INTO messages (subject, body, user_id) VALUES ($1, $2, $3)`,
    [subject, body, userId]
  );
}

async function deleteMessage(author_id, message_id) {
  await pool.query(
    `DELETE FROM messages
     WHERE user_id = $1 AND id = $2`,
    [author_id, message_id]
  );
}

module.exports = {
  signUpUser,
  findByUsername,
  findById,
  selectUser,
  grantAdminAccess,
  getAllMessages,
  createMessage,
  deleteMessage,
};
