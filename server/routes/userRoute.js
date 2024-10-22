import express from "express";
import { saveUser, searchUser, setUserStatus, getUserStatus } from "../controllers/userController.js";

const router = express.Router();

router.patch("/save", saveUser);
router.post("/search", searchUser);
router.patch("/status", setUserStatus);
router.get("/status/:userId", getUserStatus);

export default router;