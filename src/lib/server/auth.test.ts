import { describe, it, expect } from 'vitest';
import { createSessionToken, verifySessionToken } from './auth';

describe('createSessionToken', () => {
  it('returns a hex string', () => {
    const token = createSessionToken('mypassword', 'mysecret');
    expect(token).toMatch(/^[0-9a-f]{64}$/);
  });

  it('is deterministic for the same inputs', () => {
    const a = createSessionToken('pass', 'secret');
    const b = createSessionToken('pass', 'secret');
    expect(a).toBe(b);
  });

  it('differs when password changes', () => {
    const a = createSessionToken('pass1', 'secret');
    const b = createSessionToken('pass2', 'secret');
    expect(a).not.toBe(b);
  });
});

describe('verifySessionToken', () => {
  it('returns true for the correct token', () => {
    const token = createSessionToken('pw', 'sk');
    expect(verifySessionToken(token, 'pw', 'sk')).toBe(true);
  });

  it('returns false for a wrong password', () => {
    const token = createSessionToken('right', 'sk');
    expect(verifySessionToken(token, 'wrong', 'sk')).toBe(false);
  });

  it('returns false for a wrong secret', () => {
    const token = createSessionToken('pw', 'sk1');
    expect(verifySessionToken(token, 'pw', 'sk2')).toBe(false);
  });

  it('returns false for an empty token', () => {
    expect(verifySessionToken('', 'pw', 'sk')).toBe(false);
  });
});
