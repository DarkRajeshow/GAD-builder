export function isLoggedIn(req, res, next) {
    try {
        const isAuthenticated = req.isAuthenticated();
        if (isAuthenticated) {
            return res.json({ success: true });
        } else {
            return res.json({ success: false, status: "Login to continue." });
        }
    } catch (error) {
        return res.json({ success: false, status: "Internal server error" });
    }
}