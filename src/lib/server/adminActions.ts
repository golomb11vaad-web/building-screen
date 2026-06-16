import { randomUUID } from 'node:crypto';
import type { Message, MessageStyle, ImageRef, Weekday } from '../types';

export interface MessageFields {
  text: string;
  style: MessageStyle;
  pinned: boolean;
  expiresAt?: string;
  activeDays?: Weekday[];
  activeFrom?: string;
  activeUntil?: string;
  images?: ImageRef[];
}

export function applyCreate(messages: Message[], fields: MessageFields): Message[] {
  const now = new Date().toISOString();
  const msg: Message = {
    id: randomUUID(),
    text: fields.text,
    style: fields.style,
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
  if (!fields.text.trim()) return 'טקסט ההודעה הוא שדה חובה';
  if (fields.activeFrom && fields.activeUntil && fields.activeFrom > fields.activeUntil) {
    return 'תאריך התחלה חייב להיות לפני תאריך סיום';
  }
  return null;
}
