
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../model/User');

const signup__Validator = [
    check('email', 'Please enter a valid email').isEmail(),
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password must contain atleast 6 characters').isLength({
        min: 6,
    }),
]
const signin__Validator = [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password must contain atleast six characters').isLength({
        min: 6,
    }),
]

// Check if username is taken
const validate__username = async (username) => {
    let user = await User.findOne({ username })
    return user ? true : false
}

// Check if email is already been registered
const validate__email = async (email) => {
    let user = await User.findOne({ email })
    return user ? true : false
}
//Validating request...
const validationResults = (req, res, next) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        const error = result.errors[0].msg
        return res.status(400).json({ error })
    }
    next()
}

const verifyToken = (req, res) => {

    try {
        let auth = req.headers.cookie.split(" ")
        const refresh_token = auth[0].split("=")[1].replace(";", "")
        const access_token = auth[1].split("=")[1].replace(";", "")

        if (!refresh_token) {
            return res.status(404).json({ error: "You are not authorized!" })
        }

        jwt.verify(refresh_token, process.env.REFRESH_TOKEN_KEY, (err, decoded) => {

            if (err && err.name === 'JsonWebTokenError') {
                return res.status(404).json({ error: "Token Error!" })
            }

            if (err && err.name === 'TokenExpiredError') {
                return res.status(404).json({ error: "Login again!" })
            }

            const { username, id } = decoded;

            if (access_token) {
                jwt.verify(access_token, process.env.ACCESS_TOKEN_KEY, (err, access) => {
                    try {
                        if (err && err.name === 'JsonWebTokenError')
                            return res.status(404).json({ error: "Token Tampered!" })
                        if (err && err.name === 'TokenExpiredError') {
                            const access_token = generateAccessToken({ username, id })
                            return res.cookie("access_token", access_token, {
                                secure: true,
                                httpOnly: true,
                                sameSite: 'None'
                            }).json({ username, id })
                        }
                        return res.cookie("access_token", access_token, {
                            secure: true,
                            httpOnly: true,
                            sameSite: 'None'
                        }).json({ username, id })
                        
                    } catch (error) {
                        console.log(error)
                    }
                })
            }
            if (!access_token) {
                const access_token = generateAccessToken({ username })
                return res.cookie("access_token", access_token, {
                    secure: true,
                    httpOnly: true,
                    sameSite: 'None'
                }).json({ username, id })
            }
        })
    } catch (error) {
        res.status(404).json({ error: "NO TOKEN!" })
    }
}

const generateAccessToken = (payload) => {
    return jwt.sign({ ...payload }, process.env.ACCESS_TOKEN_KEY, { expiresIn: '30s' })
}



module.exports = {
    signup__Validator,
    signin__Validator,
    validationResults,
    validate__username,
    validate__email,
    verifyToken
}