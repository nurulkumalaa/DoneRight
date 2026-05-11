import pool from "../config/db.js";

// GET ALL TASKS
export const getAllTasks =
    async () => {
        const query = `
      SELECT
        t.*,
        u.username,
        c.name AS category_name
      FROM tasks t
      JOIN users u
        ON t.user_id =
          u.id_users
      LEFT JOIN categories c
        ON t.category_id =
          c.id_categories
      WHERE
        t.deleted_at
          IS NULL
      ORDER BY
        t.created_at DESC
    `;

        const result =
            await pool.query(query);

        return result.rows;
    };

// OVERDUE TASKS
export const getOverdueTasks =
    async () => {
        const query = `
      SELECT *
      FROM tasks
      WHERE
        deadline < NOW()
        AND is_completed = false
        AND deleted_at IS NULL
    `;

        const result =
            await pool.query(query);

        return result.rows;
    };

// DASHBOARD STAT
export const getStatistics =
    async () => {
        const query = `
      SELECT
      (
        SELECT COUNT(*)
        FROM users
      ) AS total_users,

      (
        SELECT COUNT(*)
        FROM tasks
        WHERE deleted_at
          IS NULL
      ) AS total_tasks,

      (
        SELECT COUNT(*)
        FROM tasks
        WHERE
          is_completed = true
          AND deleted_at
            IS NULL
      ) AS completed_tasks
    `;

        const result =
            await pool.query(query);

        return result.rows[0];
    };