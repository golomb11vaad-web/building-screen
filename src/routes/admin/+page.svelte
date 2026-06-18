<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import type { PageData } from './$types';
  import type { Message } from '$lib/types';
  import { CURATED_BACKGROUNDS } from '$lib/curatedBackgrounds';
  import { WEEKDAYS } from '$lib/types';
  export let data: PageData;

  let selectedStyle = data.editMessage?.style ?? 'plain';
  let msgText = data.editMessage?.text ?? '';

  afterNavigate(() => {
    selectedStyle = data.editMessage?.style ?? 'plain';
    msgText = data.editMessage?.text ?? '';
  });

  $: sortedMessages = [
    ...data.messages.filter((m: Message) => m.pinned),
    ...data.messages.filter((m: Message) => !m.pinned)
  ];
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
                href="/admin?edit={message.id}"
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

  <section class="admin-form">
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
        <label class="message-form__label" for="msg-text">טקסט ההודעה</label>
        <textarea
          class="message-form__textarea"
          id="msg-text"
          name="text"
          rows="3"
          required
          bind:value={msgText}
        ></textarea>
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
            העלאת תמונה {selectedStyle === 'background' ? '(אופציונלי אם בחרת רקע מהאוסף)' : ''}
          </label>
          <input
            class="message-form__input"
            id="msg-image"
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/webp"
          />
          <span class="message-form__hint">JPEG, PNG, WebP · עד 10MB</span>
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
  .admin-page {
    max-width: 60rem;
    margin: 0 auto;
    padding: var(--space-lg);
  }

  .admin-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-block-end: var(--space-lg);
    border-block-end: 1px solid var(--color-border);
    padding-block-end: var(--space-md);
  }

  .admin-nav__title {
    font-size: 1.4rem;
    margin: 0;
  }

  .admin-nav__logout {
    padding: 0.4rem 0.9rem;
    border: 1px solid var(--color-border);
    border-radius: 0.4rem;
    background: transparent;
    cursor: pointer;
  }

  .admin-list__items {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .admin-list__item {
    display: flex;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-md);
    border: 1px solid var(--color-border);
    border-radius: 0.4rem;
    align-items: baseline;
  }

  .admin-list__item--pinned {
    border-color: var(--color-pinned-accent);
  }

  .admin-list__text {
    flex: 1;
  }

  .admin-list__style {
    font-size: 0.8rem;
    color: #666;
  }

  .admin-list__actions {
    display: flex;
    gap: var(--space-sm);
    align-items: center;
    margin-inline-start: auto;
  }

  .admin-list__action-form {
    display: inline;
  }

  .admin-list__action-link {
    font-size: 0.85rem;
    color: var(--color-pinned-accent);
    text-decoration: none;
  }

  .admin-list__action-link:hover {
    text-decoration: underline;
  }

  .admin-list__action-btn {
    font-size: 0.85rem;
    padding: 0.2rem 0.6rem;
    border: 1px solid var(--color-border);
    border-radius: 0.3rem;
    background: transparent;
    cursor: pointer;
  }

  .admin-list__action-btn--danger {
    color: #b00020;
    border-color: #b00020;
  }

  .admin-form {
    margin-block-start: var(--space-xl);
    padding-block-start: var(--space-lg);
    border-block-start: 2px solid var(--color-border);
  }

  .message-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
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
    gap: var(--space-sm);
  }

  .message-form__label {
    font-weight: 600;
    font-size: 0.9rem;
  }

  .message-form__textarea,
  .message-form__input {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 0.4rem;
    font-size: 1rem;
    font-family: inherit;
    resize: vertical;
  }

  .message-form__submit {
    padding: 0.6rem 1.4rem;
    background: var(--color-pinned-accent);
    color: #fff;
    border: none;
    border-radius: 0.4rem;
    font-size: 1rem;
    cursor: pointer;
    align-self: flex-start;
  }

  .message-form__fieldset {
    border: 1px solid var(--color-border);
    border-radius: 0.4rem;
    padding: var(--space-sm) var(--space-md);
  }

  .message-form__legend {
    font-weight: 600;
    font-size: 0.9rem;
    padding-inline: 0.3rem;
  }

  .message-form__radio-label {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    cursor: pointer;
  }

  .message-form__hint {
    font-size: 0.8rem;
    color: #666;
  }

  .curated-palette {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    margin-block-start: var(--space-sm);
  }

  .curated-palette__option {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem;
    border-radius: 0.4rem;
    cursor: pointer;
    width: 6rem;
    border: 2px solid transparent;
  }

  .curated-palette__option:has(input:checked) {
    border-color: var(--color-pinned-accent);
  }

  .curated-palette__label {
    font-size: 0.75rem;
    margin-block-start: 0.3rem;
    text-align: center;
  }

  .message-form__fieldset--days {
    border: none;
    padding-inline-start: 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  .message-form__legend--small {
    font-size: 0.85rem;
    font-weight: 600;
    width: 100%;
    margin-block-end: var(--space-sm);
  }

  .message-form__date-range {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-md);
  }
</style>
