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
    padding: var(--space-lg);
  }

  .login-page__title {
    margin-block-end: var(--space-lg);
    font-size: 1.5rem;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .login-form__error {
    color: #b00020;
    font-size: 0.9rem;
    margin: 0;
  }

  .login-form__label {
    font-weight: 600;
  }

  .login-form__input {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 0.4rem;
    font-size: 1rem;
    width: 100%;
  }

  .login-form__submit {
    padding: 0.6rem 1.2rem;
    background: var(--color-pinned-accent);
    color: #fff;
    border: none;
    border-radius: 0.4rem;
    font-size: 1rem;
    cursor: pointer;
    align-self: flex-start;
  }
</style>
