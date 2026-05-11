import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

pool.on("connect", () => {
    console.log("Database connected");
});

pool.on("error", (err) => {
    console.error(
        "Database connection error:",
        err
    );
});

export default pool;