import express from "express";

import {
    getGlobalStats,
    getUsersStats,
    downloadGlobalPDF,
    downloadUserPDF,
    getMyStats,
    downloadMyPDF,
} from "../controllers/statisticsController.js";

import {
    authenticate,
} from "../middleware/authMiddleware.js";

const router =
    express.Router();

router.get(
    "/global",
    authenticate,
    getGlobalStats
);

router.get(
    "/users",
    authenticate,
    getUsersStats
);

router.get(
    "/pdf/global",
    authenticate,
    downloadGlobalPDF
);

router.get(
    "/pdf/user/:id",
    authenticate,
    downloadUserPDF
);

router.get(
    "/me",
    authenticate,
    getMyStats
);

router.get(
    "/pdf/me",
    authenticate,
    downloadMyPDF
);

export default router;