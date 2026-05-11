import express from "express";

import {
    getTasks,
    addTask,
    editTask,
    deleteTask,
    toggleComplete,
    getTrash,
    restoreDeletedTask,
    deleteTaskPermanent,
} from "../controllers/taskController.js";

import {
    authenticate,
} from "../middleware/authMiddleware.js";

const router =
    express.Router();

// GET ALL TASKS
router.get(
    "/",
    authenticate,
    getTasks
);

// GET TRASH
router.get(
    "/trash",
    authenticate,
    getTrash
);

// CREATE TASK
router.post(
    "/",
    authenticate,
    addTask
);

// UPDATE TASK
router.put(
    "/:id",
    authenticate,
    editTask
);

router.patch(
    "/restore/:id",
    authenticate,
    restoreDeletedTask
);

router.delete(
    "/permanent/:id",
    authenticate,
    deleteTaskPermanent
);

// DELETE TASK (SOFT DELETE)
router.delete(
    "/:id",
    authenticate,
    deleteTask
);

// CHECKLIST TASK
router.patch(
    "/toggle/:id",
    authenticate,
    toggleComplete
);

export default router;