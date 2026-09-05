CREATE TABLE IF NOT EXISTS screen_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  messages_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
