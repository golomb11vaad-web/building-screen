import { createHmac } from 'node:crypto';

export function createSessionToken(password: string, secret: string): string {
  return createHmac('sha256', secret).update(password).digest('hex');
}

export function verifySessionToken(token: string, password: string, secret: string): boolean {
  if (!token) return false;
  return token === createSessionToken(password, secret);
}
