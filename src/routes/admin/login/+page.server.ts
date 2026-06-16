import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ADMIN_PASSWORD, SESSION_SECRET } from '$env/static/private';
import { createSessionToken, verifySessionToken } from '$lib/server/auth';

export const load: PageServerLoad = ({ cookies }) => {
  const token = cookies.get('admin_session');
  if (token && verifySessionToken(token, ADMIN_PASSWORD, SESSION_SECRET)) {
    redirect(303, '/admin');
  }
  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const password = data.get('password') as string;

    if (password !== ADMIN_PASSWORD) {
      return fail(401, { error: 'סיסמה שגויה' });
    }

    cookies.set('admin_session', createSessionToken(ADMIN_PASSWORD, SESSION_SECRET), {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 8,
      path: '/admin'
    });

    redirect(303, '/admin');
  }
};
