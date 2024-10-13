import { WorkOS } from '@workos-inc/node';
import dotenv from "dotenv";
dotenv.config();

const workos = new WorkOS(process.env.WORKOS_API_KEY, {
  clientId: process.env.WORKOS_CLIENT_ID,
});

const withAuth = async (req, res, next) => {
  const session = workos.userManagement.loadSealedSession({
    sessionData: req.cookies['wos-session'],
    cookiePassword: process.env.WORKOS_COOKIE_PASSWORD,
  });

  const { authenticated, reason } = await session.authenticate();

  if (authenticated) {
    return next();
  }

  if (!authenticated && reason === 'no_session_cookie_provided') {
    return res.redirect('/auth/login');
  }

  try {
    const { authenticated, sealedSession } = await session.refresh();

    if (!authenticated) {
      return res.redirect('/auth/login');
    }

    res.cookie('wos-session', sealedSession, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    res.set('Access-Control-Allow-Origin', process.env.CLIENT_URL);

    return res.redirect(req.originalUrl);
  } catch (e) {
    res.clearCookie('wos-session');
    res.redirect('/auth/login');
  }
};

export { withAuth };

