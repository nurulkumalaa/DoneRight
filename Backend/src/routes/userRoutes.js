import express from "express";

import {
    getProfile,
    updateProfile,
    deleteProfile
} from "../controllers/userController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);
router.delete("/profile", authenticate, deleteProfile);

export default router;