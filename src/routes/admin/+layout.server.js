import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies, url }) => {
  // No proteger la página de login
  if (url.pathname === '/admin/login') {
    return {};
  }

  const token = cookies.get('auth_token');

  if (!token) {
    throw redirect(303, `/admin/login?redirectTo=${url.pathname}`);
  }

  return {};
};