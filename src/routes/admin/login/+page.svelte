<script lang="ts">
  import type { ActionData } from './$types';
  export let form: ActionData;
</script>

<main class="login-page">
  <h1 class="login-page__title">כניסת צוות</h1>

  <form class="login-form" method="POST">
    {#if form?.error}
      <p class="login-form__error" role="alert">{form.error}</p>
    {/if}

    <label class="login-form__label" for="password">סיסמה</label>
    <input
      class="login-form__input"
      id="password"
      type="password"
      name="password"
      required
      autocomplete="current-password"
    />

    <button class="login-form__submit" type="submit">כניסה</button>
  </form>
</main>

<style>
  .login-page {
    max-width: 22rem;
    margin: 6rem auto;
    padding: var(--space-stack-lg);
    color: var(--color-on-surface);
  }

  .login-page__title {
    font: var(--text-headline-lg);
    color: var(--color-primary);
    margin-block-end: var(--space-stack-lg);
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-stack-md);
  }

  .login-form__error {
    color: var(--color-error);
    font-size: 0.9rem;
    margin: 0;
  }

  .login-form__label {
    font: var(--text-label-caps);
    color: var(--color-on-surface-variant);
    letter-spacing: 0.05em;
  }

  .login-form__input {
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--color-outline);
    color: var(--color-on-surface);
    font: var(--text-body-lg);
    padding: 0.75rem 0;
    border-radius: 0;
    width: 100%;
    font-family: inherit;
  }

  .login-form__input:focus {
    border-color: var(--color-primary);
    outline: none;
  }

  .login-form__submit {
    padding: 0.6rem 1.2rem;
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
</style>
