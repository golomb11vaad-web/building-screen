import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import LoginPage from './+page.svelte';

describe('Login page', () => {
  it('renders the password field and submit button', () => {
    render(LoginPage, { props: { form: null } });
    expect(screen.getByLabelText(/סיסמה/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /כניסה/ })).toBeInTheDocument();
  });

  it('shows an error message when form.error is set', () => {
    render(LoginPage, { props: { form: { error: 'סיסמה שגויה' } } });
    expect(screen.getByRole('alert')).toHaveTextContent('סיסמה שגויה');
  });
});
