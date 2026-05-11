import {
    getAllTasks,
    getOverdueTasks,
    getStatistics,
} from "../models/adminModel.js";

export const getAllUserTasks =
    async (req, res) => {
        try {
            const tasks =
                await getAllTasks();

            res.status(200).json(tasks);
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message:
                    "Internal server error",
            });
        }
    };

export const overdueTasks =
    async (req, res) => {
        try {
            const tasks =
                await getOverdueTasks();

            res.status(200).json(tasks);
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message:
                    "Internal server error",
            });
        }
    };

export const statistics =
    async (req, res) => {
        try {
            const stats =
                await getStatistics();

            res.status(200).json(stats);
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message:
                    "Internal server error",
            });
        }
    };