UPDATE screen_state
SET messages_json = REPLACE(messages_json, 'סופ"ש', 'סופש'),
    updated_at = '2026-09-04T12:00:00.000Z'
WHERE id = 1;
