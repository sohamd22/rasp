import { User } from "../models/userModel.js";
import { google } from "googleapis";
import Message from "../models/messageModel.js";
import dotenv from "dotenv";
dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.CLIENT_URL,
);

const userVerification = async (req, res) => {
  console.log(req.cookies);
  const token = req.cookies.token;
  if (!token) {
    return res.json({ status: false });
  }

  try {
    const googleUser = await oAuth2Client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const user = await User.findOne({ email: googleUser.payload.email });
    if (user) {
      return res.json({ status: true, user: { ...user._doc } });
    }
    else {
      return res.json({ status: false });
    }
  } 
  catch (err) {
    console.error(err);
    return res.json({ status: false });
  }
}

export { userVerification };