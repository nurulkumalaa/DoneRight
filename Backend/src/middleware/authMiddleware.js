import jwt from "jsonwebtoken";

// AUTHENTICATE USER
export const authenticate =
    (req, res, next) => {
        try {
            const bearer =
                req.headers.authorization;

            if (!bearer) {
                return res
                    .status(401)
                    .json({
                        message:
                            "Unauthorized",
                    });
            }

            const token =
                bearer.split(" ")[1];

            const decoded =
                jwt.verify(
                    token,
                    process.env.JWT_SECRET
                );

            req.user = decoded;

            next();
        } catch (error) {
            return res
                .status(401)
                .json({
                    message:
                        "Invalid token",
                });
        }
    };

// ADMIN ONLY
export const isAdmin =
    (req, res, next) => {
        if (
            req.user.role !==
            "admin"
        ) {
            return res
                .status(403)
                .json({
                    message:
                        "Access denied",
                });
        }

        next();
    };