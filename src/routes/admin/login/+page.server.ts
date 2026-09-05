import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ADMIN_PASSWORD, SESSION_SECRET } from '$env/static/private';
import { createSessionToken, verifySessionToken } from '$lib/server/auth';

export const load: PageServerLoad = ({ cookies, platform }) => {
	const password = platform?.env.ADMIN_PASSWORD ?? ADMIN_PASSWORD;
	const secret = platform?.env.SESSION_SECRET ?? SESSION_SECRET;
  const token = cookies.get('admin_session');
	if (token && verifySessionToken(token, password, secret)) {
    redirect(303, '/admin');
  }
  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies, platform }) => {
		const expectedPassword = platform?.env.ADMIN_PASSWORD ?? ADMIN_PASSWORD;
		const secret = platform?.env.SESSION_SECRET ?? SESSION_SECRET;
    const data = await request.formData();
    const password = data.get('password') as string;

    if (password !== expectedPassword) {
      return fail(401, { error: 'סיסמה שגויה' });
    }

    cookies.set('admin_session', createSessionToken(expectedPassword, secret), {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 8,
      path: '/admin'
    });

    redirect(303, '/admin');
  }
};
