import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import pool from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

// TEST DB CONNECTION
pool.query("SELECT NOW()")
    .then(() => {
        console.log(
            "Database connected"
        );
    })
    .catch((err) => {
        console.log(err);
    });

app.use("/api/users", userRoutes);

// ROUTES
app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/tasks",
    taskRoutes
);

app.use(
    "/api/categories",
    categoryRoutes
);

app.use(
    "/api/admin",
    adminRoutes
);

// ROOT
app.get("/", (req, res) => {
    res.send(
        "DoneRight API Running"
    );
});

const PORT =
    process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});