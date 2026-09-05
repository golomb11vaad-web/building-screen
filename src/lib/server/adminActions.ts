import { randomUUID } from 'node:crypto';
import type { Message, MessageStyle, MessageTextSize, ImageRef, Weekday } from '../types';

export interface MessageFields {
  text: string;
  style: MessageStyle;
  textSize: MessageTextSize;
  pinned: boolean;
  expiresAt?: string;
  activeDays?: Weekday[];
  activeFrom?: string;
  activeUntil?: string;
  images?: ImageRef[];
}

/** Repair the escaped block tags produced by the first rich-editor release. */
export function normalizeLegacyRichText(value: string): string {
  return value
    .replace(/&(?:amp;)?nbsp;/gi, ' ')
    .replace(/&lt;(\/?)(?:div|p)(?:\s[^&]*?)?&gt;/gi, (_match, closing) => closing ? '' : '<br>')
    .replace(/^<br>/, '');
}

/** Keep a small, display-safe rich-text subset from the administrator editor. */
export function sanitizeRichText(value: string): string {
  // Browsers use DIV/P elements for Enter in a contenteditable field. Flatten
  // those block wrappers into line breaks before allowing the rich-text subset.
  const normalized = normalizeLegacyRichText(value)
    .replace(/<\/?(?:div|p)(?:\s[^>]*)?>/gi, (match) => match.startsWith('</') ? '' : '<br>')
    .replace(/^<br>/, '');
  const escaped = normalized.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const restored = escaped.replace(/&lt;(\/?(?:b|strong|i|em|u|br|ul|ol|li|a)(?:\s[^&]*?)?)&gt;/gi, (_match, tag) => {
    const closing = tag.startsWith('/');
    const name = tag.match(/^\/?([a-z]+)/i)?.[1]?.toLowerCase();
    if (!name) return '';
    if (closing) return `</${name}>`;
    if (name !== 'a') return `<${name}>`;
    const href = tag.match(/href\s*=\s*["']([^"']+)["']/i)?.[1];
    return href && /^(https?:\/\/|mailto:)/i.test(href)
      ? `<a href="${href}" target="_blank" rel="noreferrer">`
      : '<a>';
  });
  return restored.replace(/\r?\n/g, '<br>');
}

export function applyCreate(messages: Message[], fields: MessageFields): Message[] {
  const now = new Date().toISOString();
  const msg: Message = {
    id: randomUUID(),
    text: fields.text,
    style: fields.style,
    textSize: fields.textSize,
    pinned: fields.pinned,
    createdAt: now,
    updatedAt: now,
    ...(fields.expiresAt && { expiresAt: fields.expiresAt }),
    ...(fields.activeDays?.length && { activeDays: fields.activeDays }),
    ...(fields.activeFrom && { activeFrom: fields.activeFrom }),
    ...(fields.activeUntil && { activeUntil: fields.activeUntil }),
    ...(fields.images?.length && { images: fields.images }),
  };
  return [...messages, msg];
}

export function applyUpdate(messages: Message[], id: string, fields: MessageFields): Message[] {
  return messages.map((m) => {
    if (m.id !== id) return m;
    return {
      ...m,
      text: fields.text,
      style: fields.style,
      textSize: fields.textSize,
      pinned: fields.pinned,
      updatedAt: new Date().toISOString(),
      expiresAt: fields.expiresAt,
      activeDays: fields.activeDays,
      activeFrom: fields.activeFrom,
      activeUntil: fields.activeUntil,
      images: fields.images,
    };
  });
}

export function applyDelete(messages: Message[], id: string): Message[] {
  return messages.filter((m) => m.id !== id);
}

export function applyTogglePin(messages: Message[], id: string): Message[] {
  return messages.map((m) =>
    m.id === id ? { ...m, pinned: !m.pinned, updatedAt: new Date().toISOString() } : m
  );
}

export function validateMessageFields(fields: MessageFields): string | null {
  if (!fields.text.replace(/<[^>]*>/g, '').trim()) return 'טקסט ההודעה הוא שדה חובה';
  if (fields.activeFrom && fields.activeUntil && fields.activeFrom > fields.activeUntil) {
    return 'תאריך התחלה חייב להיות לפני תאריך סיום';
  }
  return null;
}
