const onlyAdminAccess = async (req, res, next) => {
    try {
        if (req.user.role !== 1) { // not an admin
            return res.status(403).json({
                success: false,
                message: "You haven't permission to access this route"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
};

module.exports = { 
    onlyAdminAccess
}