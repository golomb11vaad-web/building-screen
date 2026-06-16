import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  applyCreate,
  applyUpdate,
  applyDelete,
  applyTogglePin,
  validateMessageFields,
  type MessageFields
} from './adminActions';
import type { Message } from '../types';

const base: Message = {
  id: 'msg-1',
  text: 'שלום',
  style: 'plain',
  pinned: false,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z'
};

const fields: MessageFields = {
  text: 'הודעה חדשה',
  style: 'plain',
  pinned: false
};

describe('applyCreate', () => {
  it('appends a new message with generated id and timestamps', () => {
    const result = applyCreate([], fields);
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('הודעה חדשה');
    expect(result[0].id).toBeTruthy();
    expect(result[0].createdAt).toBeTruthy();
    expect(result[0].updatedAt).toBeTruthy();
  });

  it('does not mutate the original array', () => {
    const messages: Message[] = [base];
    applyCreate(messages, fields);
    expect(messages).toHaveLength(1);
  });

  it('includes optional schedule fields when provided', () => {
    const withSchedule: MessageFields = {
      ...fields,
      activeDays: ['sunday', 'monday'],
      activeFrom: '2026-01-01',
      activeUntil: '2026-12-31',
      expiresAt: '2026-06-30T00:00:00.000Z'
    };
    const [msg] = applyCreate([], withSchedule);
    expect(msg.activeDays).toEqual(['sunday', 'monday']);
    expect(msg.activeFrom).toBe('2026-01-01');
    expect(msg.activeUntil).toBe('2026-12-31');
    expect(msg.expiresAt).toBe('2026-06-30T00:00:00.000Z');
  });
});

describe('applyUpdate', () => {
  it('updates the matching message', () => {
    const result = applyUpdate([base], 'msg-1', { ...fields, text: 'עדכון' });
    expect(result[0].text).toBe('עדכון');
  });

  it('leaves other messages untouched', () => {
    const other: Message = { ...base, id: 'msg-2', text: 'אחר' };
    const result = applyUpdate([base, other], 'msg-1', { ...fields, text: 'עדכון' });
    expect(result[1].text).toBe('אחר');
  });

  it('updates updatedAt', () => {
    const before = base.updatedAt;
    const result = applyUpdate([base], 'msg-1', fields);
    expect(result[0].updatedAt).not.toBe(before);
  });
});

describe('applyDelete', () => {
  it('removes the message by id', () => {
    const result = applyDelete([base], 'msg-1');
    expect(result).toHaveLength(0);
  });

  it('does not remove other messages', () => {
    const other: Message = { ...base, id: 'msg-2' };
    const result = applyDelete([base, other], 'msg-1');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('msg-2');
  });
});

describe('applyTogglePin', () => {
  it('flips pinned false → true', () => {
    const result = applyTogglePin([base], 'msg-1');
    expect(result[0].pinned).toBe(true);
  });

  it('flips pinned true → false', () => {
    const pinned = { ...base, pinned: true };
    const result = applyTogglePin([pinned], 'msg-1');
    expect(result[0].pinned).toBe(false);
  });

  it('updates updatedAt on toggle', () => {
    const result = applyTogglePin([base], 'msg-1');
    expect(result[0].updatedAt).not.toBe(base.updatedAt);
  });
});

describe('validateMessageFields', () => {
  it('returns null for valid plain fields', () => {
    expect(validateMessageFields(fields)).toBeNull();
  });

  it('returns error when text is blank', () => {
    expect(validateMessageFields({ ...fields, text: '  ' })).toBeTruthy();
  });

  it('returns error when activeFrom is after activeUntil', () => {
    const bad: MessageFields = { ...fields, activeFrom: '2026-12-01', activeUntil: '2026-01-01' };
    expect(validateMessageFields(bad)).toBeTruthy();
  });

  it('returns null when only activeFrom is set', () => {
    expect(validateMessageFields({ ...fields, activeFrom: '2026-01-01' })).toBeNull();
  });
});
