import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import AdminPage from './+page.svelte';
import type { Message } from '$lib/types';

const makeMessage = (overrides: Partial<Message> = {}): Message => ({
  id: 'msg-1',
  text: 'הודעה לדוגמה',
  style: 'plain',
  pinned: false,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides
});

describe('Admin page', () => {
  it('renders the logout button', () => {
    render(AdminPage, { props: { data: { messages: [], editMessage: null } } });
    expect(screen.getByRole('button', { name: /התנתק/ })).toBeInTheDocument();
  });

  it('renders the message list', () => {
    const messages = [
      makeMessage({ id: 'm1', text: 'הודעה ראשונה' }),
      makeMessage({ id: 'm2', text: 'הודעה שנייה' })
    ];
    render(AdminPage, { props: { data: { messages, editMessage: null } } });
    expect(screen.getByText('הודעה ראשונה')).toBeInTheDocument();
    expect(screen.getByText('הודעה שנייה')).toBeInTheDocument();
  });

  it('shows a placeholder when there are no messages', () => {
    render(AdminPage, { props: { data: { messages: [], editMessage: null } } });
    expect(screen.getByText(/אין הודעות/)).toBeInTheDocument();
  });

  it('marks pinned messages', () => {
    const messages = [makeMessage({ pinned: true, text: 'הודעה מוצמדת' })];
    render(AdminPage, { props: { data: { messages, editMessage: null } } });
    expect(screen.getByText(/📌/)).toBeInTheDocument();
  });
});

describe('Admin create form', () => {
  it('renders the message text field', () => {
    render(AdminPage, { props: { data: { messages: [], editMessage: null } } });
    expect(screen.getByRole('textbox', { name: /טקסט ההודעה/ })).toBeInTheDocument();
  });

  it('renders the pin checkbox', () => {
    render(AdminPage, { props: { data: { messages: [], editMessage: null } } });
    expect(screen.getByLabelText(/מוצמד/)).toBeInTheDocument();
  });

  it('renders the submit button', () => {
    render(AdminPage, { props: { data: { messages: [], editMessage: null } } });
    expect(screen.getByRole('button', { name: /שמור הודעה/ })).toBeInTheDocument();
  });
});

describe('Style picker', () => {
  it('renders style radio buttons', () => {
    render(AdminPage, { props: { data: { messages: [], editMessage: null } } });
    expect(screen.getByLabelText(/טקסט פשוט/)).toBeInTheDocument();
    expect(screen.getByLabelText(/רקע/)).toBeInTheDocument();
    expect(screen.getByLabelText(/מצגת/)).toBeInTheDocument();
  });

  it('shows curated palette when background style is selected', async () => {
    render(AdminPage, { props: { data: { messages: [], editMessage: null } } });
    const bgRadio = screen.getByLabelText(/רקע/);
    await fireEvent.click(bgRadio);
    expect(screen.getByText('חול חמים')).toBeInTheDocument();
    expect(screen.getByText('שמיים רכים')).toBeInTheDocument();
  });

  it('hides curated palette for plain style', () => {
    render(AdminPage, { props: { data: { messages: [], editMessage: null } } });
    expect(screen.queryByText('חול חמים')).not.toBeInTheDocument();
  });
});

describe('Text size picker', () => {
  it('renders small, normal, and large text-size choices', () => {
    render(AdminPage, { props: { data: { messages: [], editMessage: null } } });
    expect(screen.getByLabelText(/קטן/)).toBeInTheDocument();
    expect(screen.getByLabelText(/רגיל/)).toBeInTheDocument();
    expect(screen.getByLabelText(/גדול/)).toBeInTheDocument();
  });
});

describe('Image upload field', () => {
  it('shows file input when background style is selected', async () => {
    render(AdminPage, { props: { data: { messages: [], editMessage: null } } });
    await fireEvent.click(screen.getByLabelText(/רקע/));
    expect(screen.getByLabelText(/תמונת רקע להודעה/)).toBeInTheDocument();
  });

  it('shows file input when photoSlideshow style is selected', async () => {
    render(AdminPage, { props: { data: { messages: [], editMessage: null } } });
    await fireEvent.click(screen.getByLabelText(/מצגת/));
    expect(screen.getByLabelText(/תמונה למצגת/)).toBeInTheDocument();
  });

  it('does not show file input for plain style', () => {
    render(AdminPage, { props: { data: { messages: [], editMessage: null } } });
    expect(screen.queryByLabelText(/תמונת רקע להודעה|תמונה למצגת/)).not.toBeInTheDocument();
  });
});

describe('Schedule fields', () => {
  it('renders the expiry date input', () => {
    render(AdminPage, { props: { data: { messages: [], editMessage: null } } });
    expect(screen.getByLabelText(/תפוגה/)).toBeInTheDocument();
  });

  it('renders all 7 day-of-week checkboxes', () => {
    render(AdminPage, { props: { data: { messages: [], editMessage: null } } });
    const boxes = screen.getAllByRole('checkbox', { name: /יום/ });
    expect(boxes).toHaveLength(7);
  });

  it('renders active date range inputs', () => {
    render(AdminPage, { props: { data: { messages: [], editMessage: null } } });
    expect(screen.getByLabelText(/תאריך התחלה/)).toBeInTheDocument();
    expect(screen.getByLabelText(/תאריך סיום/)).toBeInTheDocument();
  });
});

describe('Edit message', () => {
  const editMessage: Message = {
    id: 'edit-1',
    text: 'הודעה לעריכה',
    style: 'plain',
    pinned: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    activeDays: ['friday'],
    activeFrom: '2026-06-01',
    activeUntil: '2026-08-31'
  };

  it('pre-populates the text field with the existing message', () => {
    render(AdminPage, {
      props: { data: { messages: [], editMessage } }
    });
    const editor = screen.getByRole('textbox', { name: /טקסט ההודעה/ });
    expect(editor.innerHTML).toBe('הודעה לעריכה');
  });

  it('pre-checks the pin checkbox when message is pinned', () => {
    render(AdminPage, {
      props: { data: { messages: [], editMessage } }
    });
    const checkbox = screen.getByLabelText(/מוצמד/) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('shows "ערוך הודעה" as the form heading in edit mode', () => {
    render(AdminPage, {
      props: { data: { messages: [], editMessage } }
    });
    expect(screen.getByText('ערוך הודעה')).toBeInTheDocument();
  });
});

describe('Message list actions', () => {
  const messages = [
    makeMessage({ id: 'm1', text: 'הודעה לדוגמה', pinned: false })
  ];

  it('renders an edit link per message', () => {
    render(AdminPage, { props: { data: { messages, editMessage: null } } });
    const editLink = screen.getByRole('link', { name: /ערוך/ });
    expect(editLink).toHaveAttribute('href', '/admin?edit=m1#message-editor');
  });

  it('renders a delete button per message', () => {
    render(AdminPage, { props: { data: { messages, editMessage: null } } });
    expect(screen.getByRole('button', { name: /מחק/ })).toBeInTheDocument();
  });

  it('renders a pin toggle button per message', () => {
    render(AdminPage, { props: { data: { messages, editMessage: null } } });
    expect(screen.getByRole('button', { name: /הצמד/ })).toBeInTheDocument();
  });

  it('renders a visibility toggle per message', () => {
    render(AdminPage, { props: { data: { messages, editMessage: null } } });
    expect(screen.getByRole('button', { name: /הסתר/ })).toBeInTheDocument();
  });

  it('shows unpin label when message is pinned', () => {
    const pinned = [makeMessage({ id: 'm2', pinned: true })];
    render(AdminPage, { props: { data: { messages: pinned, editMessage: null } } });
    expect(screen.getByRole('button', { name: /בטל הצמדה/ })).toBeInTheDocument();
  });
});
