import passport from '../config/passportSetup.js';
import { User } from '../models/userModel.js';

const googleAuth = (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next, (err) => {
    if (err) {
        console.error('Google authentication error:', err);
        return res.redirect(`${process.env.CLIENT_URL}/signin?error=auth_failed`);
      }
      next();
  });
};

const googleAuthCallback = (req, res, next) => {
  console.log('Google Auth Callback initiated');
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/signin` })(req, res, async (err) => {
    if (err) {
      console.error('Authentication callback error:', err);
      return res.redirect(`${process.env.CLIENT_URL}/signin?error=auth_failed`);
    }
    console.log('Passport authentication successful');
    try {
      console.log('User from request:', req.user);
      const updatedUser = await User.findById(req.user._id).select('-embedding');
      console.log('User found:', updatedUser);
      req.login(updatedUser, (err) => {
        if (err) {
          console.error('Login error:', err);
          return res.redirect(`${process.env.CLIENT_URL}/signin?error=login_failed`);
        }
        console.log('User logged in successfully');
        res.redirect(`${process.env.CLIENT_URL}/signin?auth=success`);
      });
    } catch (error) {
      console.error('Error updating user in session:', error);
      res.redirect(`${process.env.CLIENT_URL}/signin?error=auth_failed`);
    }
  });
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Logout failed', error: err.message });
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).json({ message: 'Logout failed', error: err.message });
      }
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logout successful' });
    });
  });
};

const getUser = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  try {
    const user = await User.findById(req.user._id).select('-embedding');
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
};

export { googleAuth, googleAuthCallback, logout, getUser };
