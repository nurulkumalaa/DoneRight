import {
    getTasksByUser,
    createTask,
    updateTask,
    softDeleteTask,
    toggleTaskStatus,
    getDeletedTasks,
    restoreTask,
    permanentDeleteTask,
} from "../models/taskModel.js";

// GET TASKS
export const getTasks = async (
    req,
    res
) => {
    try {
        const userId = req.user.id;

        const tasks =
            await getTasksByUser(userId);

        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message:
                "Internal server error",
        });
    }
};

// CREATE TASK
export const addTask = async (
    req,
    res
) => {
    try {
        const task = await createTask({
            ...req.body,
            user_id: req.user.id,
        });

        res.status(201).json({
            message:
                "Task created",
            task,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message:
                "Internal server error",
        });
    }
};

// UPDATE TASK
export const editTask = async (
    req,
    res
) => {
    try {
        const { id } = req.params;

        const task =
            await updateTask(
                id,
                req.body,
                req.user.id
            );

        res.status(200).json({
            message:
                "Task updated",
            task,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message:
                "Internal server error",
        });
    }
};

// SOFT DELETE
export const deleteTask = async (
    req,
    res
) => {
    try {
        const { id } = req.params;

        await softDeleteTask(
            id,
            req.user.id
        );

        res.status(200).json({
            message:
                "Task deleted",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message:
                "Internal server error",
        });
    }
};

// CHECKLIST DONE
export const toggleComplete = async (
    req,
    res
) => {
    try {
        const { id } = req.params;

        const task =
            await toggleTaskStatus(
                id,
                req.user.id
            );

        res.status(200).json({
            message:
                "Task updated",
            task,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message:
                "Internal server error",
        });
    }
};

// GET TRASH
export const getTrash =
    async (req, res) => {
        try {
            const tasks =
                await getDeletedTasks(
                    req.user.id
                );

            res.status(200).json(
                tasks
            );
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message:
                    "Internal server error",
            });
        }
    };

// RESTORE TASK
export const restoreDeletedTask =
    async (req, res) => {
        try {
            const task =
                await restoreTask(
                    req.params.id,
                    req.user.id
                );

            res.status(200).json({
                message:
                    "Task restored",
                task,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message:
                    "Internal server error",
            });
        }
    };

// PERMANENT DELETE TASK
export const deleteTaskPermanent =
    async (req, res) => {
        try {
            const task =
                await permanentDeleteTask(
                    req.params.id,
                    req.user.id
                );

            res.status(200).json({
                message:
                    "Task permanently deleted",
                task,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message:
                    "Internal server error",
            });
        }
    };