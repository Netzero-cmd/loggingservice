export const adminOnly = (req, res, next) => {
    try {
        const role = req.headers["x-user-role"];
        if (role && role.toLowerCase() === "admin") {
            return next();
        }

        return res.status(403).json({
            message: "Access denied — admin only",
        });
    } catch (err) {
        console.error("Auth middleware error:", err);
        return res.status(500).json({ message: "Authentication check failed" });
    }
};
