-- Type: DO
-- Name: add_saved_searches
-- Description: Add saved search table

BEGIN;


CREATE TABLE IF NOT EXISTS omnivore.saved_searches (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v1mc(),
    user_id uuid NOT NULL REFERENCES omnivore.user ON DELETE CASCADE,
    name text NOT NULL,
    query text NOT NULL,
    position integer NOT NULL,
    created_at timestamptz NOT NULL DEFAULT current_timestamp,
);

CREATE UNIQUE INDEX IF NOT EXISTS saved_searches_user_id_name_idx ON omnivore.saved_searches (user_id, name);

GRANT SELECT, INSERT, UPDATE, DELETE ON omnivore.saved_searches TO omnivore_user;

INSERT INTO omnivore.saved_searches (user_id, name, query, position)
SELECT id, 'Inbox', 'in:inbox', 0
FROM omnivore.user
ON CONFLICT DO NOTHING;

INSERT INTO omnivore.saved_searches (user_id, name, query, position)
SELECT id, 'Continue Reading', 'in:inbox sort:read-desc is:unread', 1
FROM omnivore.user
ON CONFLICT DO NOTHING;

INSERT INTO omnivore.saved_searches (user_id, name, query, position)
SELECT id, 'Read Later', 'in:library', 2
FROM omnivore.user
ON CONFLICT DO NOTHING;

INSERT INTO omnivore.saved_searches (user_id, name, query, position)
SELECT id, 'Highlights', 'has:highlights mode:highlights', 3
FROM omnivore.user
ON CONFLICT DO NOTHING;

INSERT INTO omnivore.saved_searches (user_id, name, query, position)
SELECT id, 'Unlabelled', 'no:label', 4
FROM omnivore.user
ON CONFLICT DO NOTHING;

INSERT INTO omnivore.saved_searches (user_id, name, query, position)
SELECT id, 'Archived', 'in:archive', 5
FROM omnivore.user
ON CONFLICT DO NOTHING;

COMMIT;
