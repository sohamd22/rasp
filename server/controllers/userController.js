'use strict';

import natural from "natural";

import { User, Status } from "../models/userModel.js";
import { emitToConnectedClient } from '../utils/connectedClients.js';
import getEmbedding from '../utils/getEmbedding.js';

import dotenv from "dotenv";
dotenv.config();

const userCooldowns = new Map();
const COOLDOWN_DURATION = 5000;

const statusCooldowns = new Map();
const profileCooldowns = new Map();
const STATUS_COOLDOWN_DURATION = 60000; // 1 minute
const PROFILE_COOLDOWN_DURATION = 300000; // 5 minutes

const checkCooldown = (cooldownMap, userId, cooldownDuration) => {
  const now = Date.now();
  const lastActionTime = cooldownMap.get(userId) || 0;
  if (now - lastActionTime < cooldownDuration) {
    const remainingCooldown = cooldownDuration - (now - lastActionTime);
    return { onCooldown: true, remainingCooldown };
  }
  cooldownMap.set(userId, now);
  return { onCooldown: false };
};

const chunkText = (text, chunkSize = 100) => {
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(text);
  const chunks = [];
  for (let i = 0; i < tokens.length; i += chunkSize) {
    chunks.push(tokens.slice(i, i + chunkSize).join(' '));
  }
  return chunks;
};

const saveUser = async (req, res, next) => {
  const userId = req.body.user._id;
  const { onCooldown, remainingCooldown } = checkCooldown(profileCooldowns, userId, PROFILE_COOLDOWN_DURATION);
  
  if (onCooldown) {
    return res.status(429).json({ 
      error: 'Please wait before updating your profile again.',
      remainingCooldown
    });
  }

  try {
    console.log(req.body.user);
    const userData = req.body.user;
    const user = await User.findById(userData._id);
    user.name = userData.name;
    user.photo = userData.photo;
    user.about = { ...userData.about };

    const status = await Status.findOne({ user: user._id });

    const userText = `
      ${userData.about.gender} from ASU ${userData.about.campus} campus.\n
      Bio: ${userData.about.bio} \n
      Skills: ${userData.about.skills.join(", ")} \n
      Hobbies: ${userData.about.hobbies.join(", ")} \n
      Socials: ${userData.about.socials.join(", ")} \n
      Projects: ${userData.about.projects} \n
      Experience: ${userData.about.experience} \n
      ${ status ? `Status: ${status}` : "" }
    `.trim();

    const chunks = chunkText(userText);
    const embedding = await getEmbedding(chunks);
    user.embedding = embedding;
    await user.save();

    res
        .status(201)
        .json({ message: "User data has been saved" });
    next();    
  } 
  catch (error) {
    console.error(error);
  }
}


// const slidingWindowChunking = (text, windowSize = 100, stepSize = 50) => {
//   const tokenizer = new natural.WordTokenizer();
//   const tokens = tokenizer.tokenize(text);
//   const chunks = [];
//   for (let i = 0; i < tokens.length; i += stepSize) {
//     chunks.push(tokens.slice(i, i + windowSize).join(' '));
//   }
//   return chunks;
// };

const searchUser = async (req, res, next) => {
  const userId = req.body.user._id;
  const now = Date.now();
  const lastRequestTime = userCooldowns.get(userId) || 0;

  if (now - lastRequestTime < COOLDOWN_DURATION) {
    const remainingCooldown = COOLDOWN_DURATION - (now - lastRequestTime);
    return res.status(429).json({ 
      error: 'Please wait before making another request.',
      remainingCooldown
    });
  }

  userCooldowns.set(userId, now);

  try {
    const queryVector = await getEmbedding(req.body.query);
    const retrievedUsers = await User.vectorSearch(queryVector, 10);

    const formattedUsers = retrievedUsers.filter(user => user._id.toString() !== userId).map(user => ({
      name: user.name,
      email: user.email,
      photo: user.photo,
      relevantInfo: `${user.about.gender} from ASU ${user.about.campus} campus. Bio: ${user.about.bio}`,
      score: user.score
    }));

    res.json(formattedUsers);
  } 
  catch (error) {
    if (error.statusCode === 429) {
      res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    } 
    else {
      console.error('Error in searchUser:', error);
      res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
  }
}

const getUserStatus = async (req, res, next) => {
  const status = await Status.findOne({ userId: req.params.userId });
  res.json(status);
}

const setUserStatus = async (req, res, next) => {
  const userId = req.body.userId;
  const { onCooldown, remainingCooldown } = checkCooldown(statusCooldowns, userId, STATUS_COOLDOWN_DURATION);
  
  if (onCooldown) {
    return res.status(429).json({ 
      error: 'Please wait before updating your status again.',
      remainingCooldown
    });
  }

  const duration = req.body.duration;
  const expirationDate = 
    duration == "24h" ? 
    new Date(Date.now() + 24 * 60 * 60 * 1000) : (
      duration == "48h" ? 
      new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) :
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );
  let status = await Status.findOne({ user: req.body.userId });
  if (status) {
    status.content = req.body.status;
    status.expirationDate = expirationDate;
    status.save();
  }
  else {
    status = await Status.create({
      user: req.body.userId,
      content: req.body.status,
      expirationDate
    });
  }

  const user = await User.findById(req.body.userId);

  const userText = `
    ${user.about.gender} from ASU ${user.about.campus} campus.\n
    Bio: ${user.about.bio} \n
    Skills: ${user.about.skills.join(", ")} \n
    Hobbies: ${user.about.hobbies.join(", ")} \n
    Socials: ${user.about.socials.join(", ")} \n
    Projects: ${user.about.projects} \n
    Experience: ${user.about.experience} \n
    Status: ${req.body.status} \n
  `.trim();

  user.statusId = status._id;
  const chunks = chunkText(userText);
  const embedding = await getEmbedding(chunks);
  user.embedding = embedding;  
  await user.save();

  res
    .status(201)
    .json({ message: "User status has been saved" });
  next();
}

const userChangeStream = User.watch();
userChangeStream.on('change', async (change) => {
  const userId = change.documentKey._id;

  const user = await User.findById(userId);

  emitToConnectedClient(userId.toString(), 'user-update', user);
});

const statusChangeStream = Status.watch();
statusChangeStream.on('change', async (change) => {
  if (change.operationType !== 'delete') return;
  const statusId = change.documentKey._id;
  const user = await User.findOne({ statusId });

  if(user) {
    emitToConnectedClient(user._id.toString(), 'status-delete', { content: "", duration: "" });
  }  
});

export { saveUser, searchUser, setUserStatus, getUserStatus };