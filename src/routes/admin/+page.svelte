<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import type { PageData } from './$types';
  import type { Message } from '$lib/types';
  import { CURATED_BACKGROUNDS } from '$lib/curatedBackgrounds';
  import { DEFAULT_BACKGROUND_MUSIC, DEFAULT_BUILDING_PHOTO } from '$lib/ambientBackgrounds';
  import { WEEKDAYS } from '$lib/types';
  export let data: PageData;

  let selectedStyle = data.editMessage?.style ?? 'plain';
  let selectedTextSize = data.editMessage?.textSize ?? 'normal';
  let msgText = data.editMessage?.text ?? '';
  let richEditor: HTMLDivElement;

  function formatText(command: string) {
    richEditor?.focus();
    document.execCommand(command, false);
    msgText = richEditor?.innerHTML ?? msgText;
  }

  function addLink() {
    const url = window.prompt('כתובת הקישור (https://...)');
    if (!url) return;
    richEditor?.focus();
    document.execCommand('createLink', false, url);
    msgText = richEditor?.innerHTML ?? msgText;
  }

  function keepLineBreaks(event: KeyboardEvent) {
    if (event.key !== 'Enter' || event.shiftKey) return;
    event.preventDefault();
    document.execCommand('insertLineBreak', false);
    msgText = richEditor?.innerHTML ?? msgText;
  }

  afterNavigate(() => {
    selectedStyle = data.editMessage?.style ?? 'plain';
    selectedTextSize = data.editMessage?.textSize ?? 'normal';
    msgText = data.editMessage?.text ?? '';
  });

  $: sortedMessages = [
    ...data.messages.filter((m: Message) => m.pinned),
    ...data.messages.filter((m: Message) => !m.pinned)
  ];
  $: buildingPhoto = data.buildingPhoto ?? DEFAULT_BUILDING_PHOTO;
  $: backgroundMusic = data.backgroundMusic ?? DEFAULT_BACKGROUND_MUSIC;
</script>

<div class="admin-page">
  <nav class="admin-nav">
    <h1 class="admin-nav__title">ניהול הודעות</h1>
    <form method="POST" action="?/logout">
      <button class="admin-nav__logout" type="submit">התנתק</button>
    </form>
  </nav>

  <section class="admin-list">
    <h2 class="admin-list__heading">הודעות קיימות</h2>

    {#if sortedMessages.length === 0}
      <p class="admin-list__empty">אין הודעות עדיין.</p>
    {:else}
      <ul class="admin-list__items">
        {#each sortedMessages as message (message.id)}
          <li class="admin-list__item" class:admin-list__item--pinned={message.pinned}>
            <span class="admin-list__pin">{message.pinned ? '📌' : ''}</span>
            <span class="admin-list__text">{message.text}</span>
            <span class="admin-list__style">{message.style}</span>

            <div class="admin-list__actions">
              <a
                class="admin-list__action-link"
                href="/admin?edit={message.id}#message-editor"
              >ערוך</a>

              <form method="POST" action="?/togglePin" class="admin-list__action-form">
                <input type="hidden" name="id" value={message.id} />
                <button class="admin-list__action-btn" type="submit">
                  {message.pinned ? 'בטל הצמדה' : 'הצמד'}
                </button>
              </form>

              <form
                method="POST"
                action="?/delete"
                class="admin-list__action-form"
                on:submit={(e) => { if (!confirm('למחוק את ההודעה?')) e.preventDefault(); }}
              >
                <input type="hidden" name="id" value={message.id} />
                <button class="admin-list__action-btn admin-list__action-btn--danger" type="submit">
                  מחק
                </button>
              </form>
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </section>

  <section class="ambient-manager">
    <div class="ambient-manager__intro">
      <p class="ambient-manager__eyebrow">מוצג במסך הראשי</p>
      <h2>תמונות האווירה</h2>
      <p>שלוש התמונות מתחלפות ברכות ברקע. העלאת תמונה מחליפה את המיקום המתאים.</p>
    </div>
    <article class="building-photo-manager">
      <div class="building-photo-manager__preview" style={`background-image: url('${buildingPhoto.src}')`}>
        <span>תמונת הבניין</span>
      </div>
      <form method="POST" action="?/replaceBuildingPhoto" enctype="multipart/form-data">
        <label>
          שם התמונה
          <input name="label" value={buildingPhoto.label} />
        </label>
        <label>
          החלפת תמונת הבניין
          <input type="file" name="image" accept="image/jpeg,image/png,image/webp" required />
        </label>
        <button type="submit">עדכן תמונת בניין</button>
      </form>
    </article>
    <article class="music-manager">
      <div>
        <p class="ambient-manager__eyebrow">מוזיקת רקע</p>
        <h2>{backgroundMusic.label}</h2>
        <p>המסך מנגן את הקובץ הזה בלולאה. אפשר להחליף אותו בכל קובץ MP3 עד 100MB.</p>
        <audio class="music-manager__player" controls src={backgroundMusic.src}></audio>
      </div>
      <form method="POST" action="?/replaceBackgroundMusic" enctype="multipart/form-data">
        <label>
          שם הרצועה (אופציונלי)
          <input name="label" value={backgroundMusic.label} />
        </label>
        <label>
          החלפת מוזיקה
          <input type="file" name="music" accept="audio/mpeg,.mp3" required />
        </label>
        <button type="submit">העלה והפעל מוזיקה</button>
      </form>
    </article>
    <div class="ambient-manager__grid">
      {#each data.ambientBackgrounds ?? [] as background, index (background.id)}
        <article class="ambient-manager__card">
          <div class="ambient-manager__preview" style={`background-image: url('${background.src}')`}>
            <span>תמונה {index + 1}</span>
          </div>
          <form method="POST" action="?/replaceAmbientBackground" enctype="multipart/form-data">
            <input type="hidden" name="slot" value={index} />
            <label>
              שם (אופציונלי)
              <input name="label" value={background.label} />
            </label>
            <label>
              החלפת תמונה
              <input type="file" name="image" accept="image/jpeg,image/png,image/webp" required />
            </label>
            <button type="submit">החלף תמונה</button>
          </form>
        </article>
      {/each}
    </div>
  </section>

  <section class="admin-form" id="message-editor" tabindex="-1">
    <h2 class="admin-form__heading">
      {data.editMessage ? 'ערוך הודעה' : 'הוסף הודעה'}
    </h2>

    <form
      class="message-form"
      method="POST"
      action={data.editMessage ? '?/update' : '?/create'}
      enctype="multipart/form-data"
    >
      {#if data.editMessage}
        <input type="hidden" name="id" value={data.editMessage.id} />
      {/if}

      <div class="message-form__field">
        <span class="message-form__label" id="msg-text-label">טקסט ההודעה</span>
        <div class="rich-editor__toolbar" aria-label="עיצוב טקסט">
          <button type="button" on:click={() => formatText('bold')} title="מודגש"><strong>B</strong></button>
          <button type="button" on:click={() => formatText('italic')} title="נטוי"><em>I</em></button>
          <button type="button" on:click={() => formatText('underline')} title="קו תחתון"><u>U</u></button>
          <button type="button" on:click={() => formatText('insertUnorderedList')} title="רשימה">• רשימה</button>
          <button type="button" on:click={addLink} title="קישור">קישור</button>
        </div>
        <div
          class="rich-editor"
          id="msg-text"
          contenteditable="true"
          tabindex="0"
          role="textbox"
          aria-labelledby="msg-text-label"
          aria-multiline="true"
          on:keydown={keepLineBreaks}
          bind:this={richEditor}
          bind:innerHTML={msgText}
        ></div>
        <input type="hidden" name="text" value={msgText} />
      </div>

      <div class="message-form__field message-form__field--inline">
        <input
          class="message-form__checkbox"
          id="msg-pinned"
          type="checkbox"
          name="pinned"
          checked={data.editMessage?.pinned ?? false}
        />
        <label class="message-form__label" for="msg-pinned">מוצמד (מוצג ראשון)</label>
      </div>

      <fieldset class="message-form__fieldset">
        <legend class="message-form__legend">גודל טקסט</legend>
        <div class="message-form__size-options">
          <label class="message-form__radio-label">
            <input type="radio" name="textSize" value="small" bind:group={selectedTextSize} /> קטן
          </label>
          <label class="message-form__radio-label">
            <input type="radio" name="textSize" value="normal" bind:group={selectedTextSize} /> רגיל
          </label>
          <label class="message-form__radio-label">
            <input type="radio" name="textSize" value="large" bind:group={selectedTextSize} /> גדול
          </label>
        </div>
      </fieldset>

      <!-- Style picker -->
      <fieldset class="message-form__fieldset">
        <legend class="message-form__legend">סגנון תצוגה</legend>
        <label class="message-form__radio-label">
          <input
            type="radio"
            name="style"
            value="plain"
            bind:group={selectedStyle}
          /> טקסט פשוט
        </label>
        <label class="message-form__radio-label">
          <input
            type="radio"
            name="style"
            value="background"
            bind:group={selectedStyle}
          /> רקע
        </label>
        <label class="message-form__radio-label">
          <input
            type="radio"
            name="style"
            value="photoSlideshow"
            bind:group={selectedStyle}
          /> מצגת
        </label>
      </fieldset>

      <!-- Curated background palette (background style only) -->
      {#if selectedStyle === 'background'}
        <fieldset class="message-form__fieldset">
          <legend class="message-form__legend">רקע מהאוסף</legend>
          <div class="curated-palette">
            {#each CURATED_BACKGROUNDS as bg}
              <label
                class="curated-palette__option"
                style="background: {bg.css}"
              >
                <input
                  type="radio"
                  name="curatedRef"
                  value={bg.id}
                  checked={data.editMessage?.images?.[0]?.source === 'curated' &&
                           data.editMessage?.images?.[0]?.ref === bg.id}
                />
                <span class="curated-palette__label">{bg.label}</span>
              </label>
            {/each}
          </div>
        </fieldset>
      {/if}

      <!-- Image upload field -->
      {#if selectedStyle === 'background' || selectedStyle === 'photoSlideshow'}
        <div class="message-form__field">
          <label class="message-form__label" for="msg-image">
            {selectedStyle === 'background' ? 'תמונת רקע להודעה' : 'תמונה למצגת'}
          </label>
          <input
            class="message-form__input"
            id="msg-image"
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/webp"
          />
          <span class="message-form__hint">JPEG, PNG, WebP · עד 10MB. תמונת רקע תתפרס על כל ההודעה.</span>
          {#if data.editMessage?.images?.[0]?.source === 'upload'}
            <img
              class="message-form__image-preview"
              src="/uploads/{data.editMessage.images[0].ref}"
              alt="תמונת הרקע הנוכחית"
            />
          {/if}
        </div>
      {/if}

      <!-- Schedule fields -->
      <fieldset class="message-form__fieldset">
        <legend class="message-form__legend">לוח זמנים (אופציונלי)</legend>

        <div class="message-form__field">
          <label class="message-form__label" for="msg-expires">תפוגה (תאריך ושעה)</label>
          <input
            class="message-form__input"
            id="msg-expires"
            type="datetime-local"
            name="expiresAt"
            value={data.editMessage?.expiresAt
              ? new Date(data.editMessage.expiresAt).toISOString().slice(0, 16)
              : ''}
          />
        </div>

        <fieldset class="message-form__fieldset message-form__fieldset--days">
          <legend class="message-form__legend--small">ימים פעילים</legend>
          {#each WEEKDAYS as day}
            <label class="message-form__radio-label" for="day-{day}">
              <input
                id="day-{day}"
                type="checkbox"
                name="activeDays"
                value={day}
                checked={data.editMessage?.activeDays?.includes(day) ?? false}
              />
              יום {day === 'sunday' ? 'ראשון' :
                    day === 'monday' ? 'שני' :
                    day === 'tuesday' ? 'שלישי' :
                    day === 'wednesday' ? 'רביעי' :
                    day === 'thursday' ? 'חמישי' :
                    day === 'friday' ? 'שישי' : 'שבת'}
            </label>
          {/each}
        </fieldset>

        <div class="message-form__date-range">
          <div class="message-form__field">
            <label class="message-form__label" for="msg-from">תאריך התחלה</label>
            <input
              class="message-form__input"
              id="msg-from"
              type="date"
              name="activeFrom"
              value={data.editMessage?.activeFrom ?? ''}
            />
          </div>
          <div class="message-form__field">
            <label class="message-form__label" for="msg-until">תאריך סיום</label>
            <input
              class="message-form__input"
              id="msg-until"
              type="date"
              name="activeUntil"
              value={data.editMessage?.activeUntil ?? ''}
            />
          </div>
        </div>
      </fieldset>

      <button class="message-form__submit" type="submit">שמור הודעה</button>
    </form>
  </section>
</div>

<style>
  :global(html),
  :global(body) {
    height: auto;
    min-height: 100%;
    overflow: auto;
  }

  :global(body) {
    font-size: 16px;
  }

  .admin-page {
    --text-headline-lg: 500 2rem/1.2 'Heebo', sans-serif;
    --text-headline-md: 500 1.5rem/1.25 'Heebo', sans-serif;
    --text-body-lg: 400 1rem/1.5 'Heebo', sans-serif;
    --text-label-caps: 700 0.75rem/1.25 'Heebo', sans-serif;
    --space-safe-margin: 1.5rem;
    --space-stack-sm: 0.5rem;
    --space-stack-md: 1rem;
    --space-stack-lg: 2rem;
    background: var(--color-surface);
    color: var(--color-on-surface);
    width: min(100%, 72rem);
    margin-inline: auto;
    padding: var(--space-safe-margin);
    min-height: 100vh;
  }

  .admin-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-block-end: var(--space-stack-lg);
    border-block-end: 1px solid var(--color-outline-variant);
    padding-block-end: var(--space-stack-md);
  }

  .admin-nav__title {
    font: var(--text-headline-lg);
    color: var(--color-on-surface);
    margin: 0;
  }

  .admin-nav__logout {
    padding: 0.4rem 0.9rem;
    border: 1px solid var(--color-outline);
    border-radius: 0.25rem;
    background: transparent;
    color: var(--color-on-surface-variant);
    cursor: pointer;
    font-family: inherit;
  }

  .admin-list__heading {
    font: var(--text-headline-md);
    color: var(--color-on-surface);
    margin: 0 0 var(--space-stack-md);
  }

  .admin-list__empty {
    color: var(--color-on-surface-variant);
  }

  .admin-list__items {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-stack-sm);
  }

  .admin-list__item {
    display: flex;
    gap: var(--space-stack-sm);
    padding: var(--space-stack-sm) var(--space-stack-md);
    border: 1px solid var(--color-outline-variant);
    border-radius: 0.25rem;
    align-items: baseline;
    background: transparent;
    transition: background 200ms;
  }

  .admin-list__item:hover {
    background: var(--color-surface-container);
  }

  .admin-list__item--pinned {
    border-color: var(--color-primary);
  }

  .admin-list__text {
    flex: 1;
    color: var(--color-on-surface);
  }

  .admin-list__style {
    font: var(--text-label-caps);
    background: var(--color-surface-container-highest);
    color: var(--color-primary);
    padding: 0.15rem 0.5rem;
    border-radius: 0.25rem;
    letter-spacing: 0.05em;
  }

  .admin-list__actions {
    display: flex;
    gap: var(--space-stack-sm);
    align-items: center;
    margin-inline-start: auto;
  }

  .admin-list__action-form {
    display: inline;
  }

  .admin-list__action-link {
    font-size: 0.85rem;
    color: var(--color-primary);
    text-decoration: none;
  }

  .admin-list__action-link:hover {
    text-decoration: underline;
  }

  .admin-list__action-btn {
    font-size: 0.85rem;
    padding: 0.2rem 0.6rem;
    border: 1px solid var(--color-outline);
    border-radius: 0.25rem;
    background: transparent;
    color: var(--color-on-surface);
    cursor: pointer;
    font-family: inherit;
  }

  .admin-list__action-btn--danger {
    color: var(--color-error);
    border-color: var(--color-error);
  }

  .admin-form {
    margin-block-start: var(--space-stack-lg);
    padding-block-start: var(--space-stack-lg);
    border-block-start: 1px solid var(--color-outline-variant);
  }

  .ambient-manager {
    margin-block-start: var(--space-stack-lg);
    padding-block-start: var(--space-stack-lg);
    border-block-start: 1px solid var(--color-outline-variant);
  }

  .ambient-manager__intro h2 {
    font: var(--text-headline-md);
    color: var(--color-on-surface);
    margin: 0;
  }

  .ambient-manager__intro p:not(.ambient-manager__eyebrow) {
    color: var(--color-on-surface-variant);
    margin: 6px 0 0;
  }

  .ambient-manager__eyebrow {
    font: var(--text-label-caps);
    color: var(--color-primary);
    letter-spacing: 0.05em;
    margin: 0 0 4px;
  }

  .ambient-manager__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
    gap: var(--space-stack-md);
    margin-block-start: var(--space-stack-md);
  }

  .building-photo-manager {
    display: grid;
    grid-template-columns: minmax(13rem, 18rem) minmax(15rem, 24rem);
    gap: var(--space-stack-md);
    align-items: stretch;
    margin-block: var(--space-stack-md);
    border: 1px solid var(--color-outline-variant);
    border-radius: 16px;
    overflow: hidden;
  }

  .music-manager {
    display: grid;
    grid-template-columns: minmax(15rem, 1fr) minmax(15rem, 24rem);
    gap: var(--space-stack-md);
    align-items: center;
    margin-block: var(--space-stack-md);
    padding: 18px;
    border: 1px solid var(--color-outline-variant);
    border-radius: 16px;
    background: var(--color-surface-container-low);
  }

  .music-manager h2 { font: var(--text-headline-md); margin: 0; }
  .music-manager p:not(.ambient-manager__eyebrow) { color: var(--color-on-surface-variant); margin: 6px 0 12px; }
  .music-manager__player { width: min(100%, 28rem); }
  .music-manager form { display: grid; gap: 10px; }
  .music-manager label { display: grid; gap: 4px; color: var(--color-on-surface-variant); font: var(--text-label-caps); }
  .music-manager button {
    justify-self: start; border: 0; border-radius: 8px; padding: 8px 12px;
    background: var(--color-primary); color: var(--color-on-primary); font: inherit; font-weight: 700; cursor: pointer;
  }

  .building-photo-manager__preview {
    min-height: 11rem;
    display: flex;
    align-items: end;
    padding: 14px;
    background-size: cover;
    background-position: center;
  }

  .building-photo-manager__preview span {
    color: #fff;
    background: rgba(8, 36, 47, 0.7);
    border-radius: 999px;
    padding: 3px 10px;
    font: var(--text-label-caps);
  }

  .building-photo-manager form {
    display: grid;
    align-content: center;
    gap: 10px;
    padding: 14px 14px 14px 0;
  }

  .building-photo-manager label {
    display: grid;
    gap: 4px;
    color: var(--color-on-surface-variant);
    font: var(--text-label-caps);
  }

  .building-photo-manager button {
    justify-self: start;
    border: 0;
    border-radius: 8px;
    padding: 8px 12px;
    background: var(--color-primary);
    color: var(--color-on-primary);
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }

  @media (max-width: 650px) {
    .building-photo-manager { grid-template-columns: 1fr; }
    .building-photo-manager form { padding: 0 14px 14px; }
    .music-manager { grid-template-columns: 1fr; }
  }

  .ambient-manager__card {
    overflow: hidden;
    border: 1px solid var(--color-outline-variant);
    border-radius: 16px;
    background: var(--color-surface-container-low);
  }

  .ambient-manager__preview {
    height: 9rem;
    display: flex;
    align-items: end;
    padding: 12px;
    background-size: cover;
    background-position: center;
  }

  .ambient-manager__preview span {
    color: white;
    background: rgba(8, 36, 47, 0.68);
    padding: 2px 9px;
    border-radius: 999px;
    font: var(--text-label-caps);
  }

  .ambient-manager__card form {
    display: grid;
    gap: 10px;
    padding: 14px;
  }

  .ambient-manager__card label {
    display: grid;
    gap: 4px;
    color: var(--color-on-surface-variant);
    font: var(--text-label-caps);
  }

  .ambient-manager__card input {
    max-width: 100%;
    font: inherit;
  }

  .ambient-manager__card button {
    justify-self: start;
    border: 0;
    border-radius: 8px;
    padding: 8px 12px;
    background: var(--color-primary);
    color: var(--color-on-primary);
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }

  .admin-form__heading {
    font: var(--text-headline-md);
    color: var(--color-primary);
    margin: 0 0 var(--space-stack-md);
  }

  .message-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-stack-md);
    max-width: 36rem;
  }

  .message-form__field {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .message-form__field--inline {
    flex-direction: row;
    align-items: center;
    gap: var(--space-stack-sm);
  }

  .message-form__label {
    font: var(--text-label-caps);
    color: var(--color-on-surface-variant);
    letter-spacing: 0.05em;
  }

  .message-form__input {
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--color-outline);
    color: var(--color-on-surface);
    font: var(--text-body-lg);
    padding: 0.75rem 0;
    border-radius: 0;
    font-family: inherit;
    resize: vertical;
  }

  .message-form__input:focus {
    border-color: var(--color-primary);
    outline: none;
  }

  .rich-editor__toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 8px;
    border: 1px solid var(--color-outline);
    border-bottom: 0;
    border-radius: 10px 10px 0 0;
    background: var(--color-surface-container-low);
  }

  .rich-editor__toolbar button {
    border: 1px solid var(--color-outline-variant);
    border-radius: 6px;
    padding: 5px 9px;
    background: var(--color-surface-container-high);
    color: var(--color-on-surface);
    cursor: pointer;
    font: 500 0.9rem/1 'Heebo', sans-serif;
  }

  .rich-editor {
    min-height: 9rem;
    padding: 14px;
    border: 1px solid var(--color-outline);
    border-radius: 0 0 10px 10px;
    background: var(--color-surface-container-high);
    color: var(--color-on-surface);
    font: var(--text-body-lg);
    outline: none;
  }

  .rich-editor:focus { border-color: var(--color-primary); }
  .rich-editor :global(ul), .rich-editor :global(ol) { padding-inline-start: 1.4em; }

  .message-form__image-preview {
    width: min(100%, 22rem);
    max-height: 12rem;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid var(--color-outline-variant);
  }

  .message-form__submit {
    padding: 0.6rem 1.4rem;
    background: var(--color-primary);
    color: var(--color-on-primary);
    border: none;
    border-radius: 0.25rem;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    align-self: flex-start;
    font-family: inherit;
  }

  .message-form__fieldset {
    border: 1px solid var(--color-outline-variant);
    border-radius: 0.25rem;
    padding: var(--space-stack-sm) var(--space-stack-md);
  }

  .message-form__legend {
    font: var(--text-label-caps);
    color: var(--color-on-surface-variant);
    padding-inline: 0.3rem;
    letter-spacing: 0.05em;
  }

  .message-form__radio-label {
    display: flex;
    align-items: center;
    gap: var(--space-stack-sm);
    cursor: pointer;
    color: var(--color-on-surface);
  }

  .message-form__size-options {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-stack-md);
  }

  .message-form__hint {
    font: var(--text-label-caps);
    color: var(--color-on-surface-variant);
    letter-spacing: 0.05em;
  }

  .curated-palette {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-stack-sm);
    margin-block-start: var(--space-stack-sm);
  }

  .curated-palette__option {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem;
    border-radius: 0.25rem;
    cursor: pointer;
    width: 6rem;
    border: 2px solid transparent;
  }

  .curated-palette__option:has(input:checked) {
    border-color: var(--color-primary);
  }

  .curated-palette__label {
    font-size: 0.75rem;
    margin-block-start: 0.3rem;
    text-align: center;
    color: var(--color-on-surface-variant);
  }

  .message-form__fieldset--days {
    border: none;
    padding-inline-start: 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-stack-sm);
  }

  .message-form__legend--small {
    font: var(--text-label-caps);
    color: var(--color-on-surface-variant);
    width: 100%;
    margin-block-end: var(--space-stack-sm);
    letter-spacing: 0.05em;
  }

  .message-form__date-range {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-stack-md);
  }
</style>
