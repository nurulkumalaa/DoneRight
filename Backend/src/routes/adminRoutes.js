import express from "express";

import {
    getAllUserTasks,
    overdueTasks,
    statistics,
} from "../controllers/adminController.js";

import {
    authenticate,
    isAdmin,
} from "../middleware/authMiddleware.js";

const router =
    express.Router();

// ALL TASKS
router.get(
    "/tasks",
    authenticate,
    isAdmin,
    getAllUserTasks
);

// OVERDUE
router.get(
    "/overdue",
    authenticate,
    isAdmin,
    overdueTasks
);

// STATISTICS
router.get(
    "/statistics",
    authenticate,
    isAdmin,
    statistics
);

export default router;