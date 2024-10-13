import { WorkOS } from '@workos-inc/node';
import dotenv from "dotenv";
dotenv.config();

const workos = new WorkOS(process.env.WORKOS_API_KEY, {
  clientId: process.env.WORKOS_CLIENT_ID,
});

const login = (req, res) => {
  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    provider: 'authkit',
    redirectUri: `${process.env.SERVER_URL}/auth/callback`,
    clientId: process.env.WORKOS_CLIENT_ID,
  });

  res.redirect(authorizationUrl);
};

const callback = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('No code provided');
  }

  try {
    const authenticateResponse =
      await workos.userManagement.authenticateWithCode({
        clientId: process.env.WORKOS_CLIENT_ID,
        code,
        session: {
          sealSession: true,
          cookiePassword: process.env.WORKOS_COOKIE_PASSWORD,
        },
      });

    const { user, sealedSession } = authenticateResponse;

    console.log(user);

    res.cookie('wos-session', sealedSession, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    return res.redirect(`${process.env.CLIENT_URL}/`);
  } catch (error) {
    return res.redirect('/auth/login');
  }
};

const getUser = async (req, res) => {
  try {
    const session = workos.userManagement.loadSealedSession({
      sessionData: req.cookies['wos-session'],
      cookiePassword: process.env.WORKOS_COOKIE_PASSWORD,
    });

    const { user } = await session.authenticate();

    console.log(`User ${user.firstName} is logged in`);

    res.json({ success: true, user: { name: user.firstName, email: user.email } });
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.json({ success: false, error: 'Authentication failed' });
  }
};

const logout = async (req, res) => {
  const session = workos.userManagement.loadSealedSession({
    sessionData: req.cookies['wos-session'],
    cookiePassword: process.env.WORKOS_COOKIE_PASSWORD,
  });

  const url = await session.getLogoutUrl();

  res.clearCookie('wos-session');
  res.redirect(url);
};

export { login, callback, getUser, logout };
