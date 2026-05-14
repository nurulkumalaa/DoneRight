import {
    getGlobalStatistics,
    getUserStatistics,
    getSingleUserStats,
} from "../models/statisticsModel.js";

import {
    generateGlobalPDF,
    generateUserPDF,
} from "../pdf/reportGenerator.js";

export const getGlobalStats =
    async (req, res) => {

        try {

            const stats =
                await getGlobalStatistics();

            res.json(stats);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Internal server error",
            });
        }
    };

export const getUsersStats =
    async (req, res) => {

        try {

            const stats =
                await getUserStatistics();

            const data =
                stats.map(
                    (user) => ({
                        ...user,

                        productivity:
                            user.total_tasks >
                                0
                                ? (
                                    (user.on_time /
                                        user.total_tasks) *
                                    100
                                ).toFixed(1)
                                : 0,
                    })
                );

            res.json(data);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Internal server error",
            });
        }
    };

export const downloadGlobalPDF =
    async (req, res) => {

        try {

            const stats =
                await getGlobalStatistics();

            const productivity =
                stats.total_tasks > 0
                    ? (
                        (
                            stats.on_time /
                            stats.total_tasks
                        ) * 100
                    ).toFixed(1)
                    : 0;

            generateGlobalPDF(
                res,
                {
                    ...stats,
                    productivity,
                }
            );

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Internal server error",
            });
        }
    };

export const downloadUserPDF =
    async (
        req,
        res
    ) => {

        const { id } =
            req.params;

        const user =
            await getSingleUserStats(
                id
            );

        generateUserPDF(
            res,
            user
        );
    };

export const getMyStats =
    async (req, res) => {

        try {

            const stats =
                await getSingleUserStats(req.user.id);

            const productivity =
                stats.total_tasks > 0
                    ? (
                        (stats.on_time /
                            stats.total_tasks) *
                        100
                    ).toFixed(1)
                    : 0;

            res.json({ ...stats, productivity });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Internal server error",
            });
        }
    };

export const downloadMyPDF =
    async (req, res) => {

        try {

            const user =
                await getSingleUserStats(req.user.id);

            generateUserPDF(res, user);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Internal server error",
            });
        }
    };