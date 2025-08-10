const mongoose = require('mongoose')

exports.CheckUSerCookies = async (req, res) => {
    res.status(200).json({
        isAuthenticated: true,
        user: {
            id: req.user.id,
            email: req.user.email,
        }
    });
};



















