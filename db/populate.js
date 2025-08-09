const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  first_name VARCHAR(25) NOT NULL,
  last_name  VARCHAR(25) NOT NULL,
  username   VARCHAR(25) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  is_admin  BOOLEAN DEFAULT false,
  is_member BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
`;

const createMessageTable = `
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  subject VARCHAR(50) NOT NULL,
  body VARCHAR(150) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT body_min_len CHECK (char_length(body) >= 10)
);
`;

const seedScriptSQL = `
${createUsersTable}
${createMessageTable}

-- Seed users
INSERT INTO users (first_name, last_name, username, password_hash, is_admin, is_member)
VALUES
('Root', 'Admin', 'root', 'HASHEDPASSWORD1', true, true),
('Cipher', 'Bot', 'cipherbot', 'HASHEDPASSWORD2', true, false),
('Main', 'Admin', 'admin', 'HASHEDPASSWORD3', true, true),
('Sys', 'Watch', 'syswatch', 'HASHEDPASSWORD4', false, true);

-- Seed messages
INSERT INTO messages (subject, body, user_id, created_at)
VALUES
('System Breach Attempt Detected',
 'Unauthorized login from IP 192.168.7.44 was blocked. Watchdog protocol elevated for 24 hours.',
 1,
 '2025-08-06 22:17:00'),

('Encryption Sequence Initiated',
 'Tier-1 core encrypted. Next wave to follow in 7 minutes. Admin override locked.',
 2,
 '2025-08-06 21:45:00'),

('Cipher Format Update',
 'All passphrases now require reversed input. e.g., "emanym". Rotation key shifts weekly.',
 3,
 '2025-08-06 21:12:00'),

('System Health: Stable',
 'No anomalies detected across all monitored nodes. Network activity within baseline thresholds.',
 4,
 '2025-08-06 20:58:00');
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  await client.query(seedScriptSQL);
  await client.end();
  console.log("DB has been reset.");
}

main();