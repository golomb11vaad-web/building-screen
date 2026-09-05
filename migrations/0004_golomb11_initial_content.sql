INSERT INTO screen_state (id, messages_json, ambient_json, building_photo_json, updated_at)
VALUES (
  1,
  '[{"id":"golomb-welcome","text":"ברוכים הבאים לגולומב 11\\nשמחים שאתם כאן. נא שימרו על הניקיון!","style":"background","images":[{"id":"golomb-welcome-image","source":"upload","ref":"golomb-11-slide-1.jpg"}],"pinned":true,"createdAt":"2026-09-04T08:00:00.000Z","updatedAt":"2026-09-04T08:00:00.000Z"},{"id":"golomb-cleaning","text":"לוח זמנים ניקיון בניין\\n• יום א'' – לובי ראשי, לובי קומות, מעליות, חדר מדרגות.\\n• יום ג'' – לובי ראשי, מעליות, שטחים משותפים/חוץ.\\n• יום ה'' – לובי ראשי, לובי קומות, מעליות, חדר מדרגות.","style":"background","images":[{"id":"golomb-cleaning-image","source":"upload","ref":"golomb-11-slide-2.jpg"}],"pinned":false,"createdAt":"2026-09-04T08:01:00.000Z","updatedAt":"2026-09-04T08:01:00.000Z"},{"id":"golomb-shabbat-lift","text":"שעות מעלית שבת\\nשישי: 18:30-20:30, 22:00-23:00\\nשבת: 09:30-10:00, 11:00-11:30","style":"background","images":[{"id":"golomb-shabbat-lift-image","source":"upload","ref":"golomb-11-slide-3.jpg"}],"pinned":false,"createdAt":"2026-09-04T08:02:00.000Z","updatedAt":"2026-09-04T08:02:00.000Z"},{"id":"golomb-image-notice","text":"עדכוני הבניין\\nמידע חשוב לדיירים","style":"background","images":[{"id":"golomb-image-notice-image","source":"upload","ref":"golomb-11-slide-4.jpg"}],"pinned":false,"createdAt":"2026-09-04T08:03:00.000Z","updatedAt":"2026-09-04T08:03:00.000Z"},{"id":"golomb-weekday","text":"יום נעים מלא בחיוכים!\\nיש לשים לב לסגירת דלתות הלובי בכל עת","style":"background","images":[{"id":"golomb-weekday-image","source":"upload","ref":"golomb-11-weekday.jpg"}],"pinned":false,"createdAt":"2026-09-04T08:04:00.000Z","updatedAt":"2026-09-04T08:04:00.000Z"},{"id":"golomb-weekend","text":"סוף שבוע נעים וחמים :)\\nסופ"ש נעים ושבת שלום!","style":"background","images":[{"id":"golomb-weekend-image","source":"upload","ref":"golomb-11-weekend.jpg"}],"pinned":false,"createdAt":"2026-09-04T08:05:00.000Z","updatedAt":"2026-09-04T08:05:00.000Z"}]',
  '[{"id":"courtyard","label":"חצר בוקר","src":"/ambient/courtyard-morning.png"},{"id":"coast","label":"חוף בין הערביים","src":"/ambient/coast-blue-hour.png"},{"id":"garden","label":"גינה אחרי הגשם","src":"/ambient/garden-after-rain.png"}]',
  '{"id":"golomb-11-building","label":"גולומב 11, נהריה","src":"/uploads/golomb-11-building.jpg"}',
  '2026-09-04T09:00:00.000Z'
)
ON CONFLICT(id) DO UPDATE SET
  messages_json = excluded.messages_json,
  ambient_json = excluded.ambient_json,
  building_photo_json = excluded.building_photo_json,
  updated_at = excluded.updated_at;
