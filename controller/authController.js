const User = require('../model/User')
const bcrypt = require('bcryptjs');
const { validate__username, validate__email } = require('../middlewares/authMiddleware');
const jwt = require('jsonwebtoken')

const signin__controller = async (req, res) => {

    const { username, password } = req.body
    try {
        //Checking User...
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        //Checking Password...
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' })
        }

        // ===============================================
        let payload = {
            id: user._id,
            username
        }

        const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, { expiresIn: '30s' })
        const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, { expiresIn: '10m' })

        res.cookie("refresh_token", refresh_token, {
            secure: true,
            httpOnly: true,
            sameSite: "none",
        })
        res.cookie("access_token", access_token, {
            secure: true,
            httpOnly: true,
            sameSite: 'None'
        })

        res.json({ ...payload })

    } catch (error) {
        res.status(400).json({ message: "Internal Server Error" });
    }
}

//===============SIGNUP controller===============

const signup__controller = async (req, res) => {

    try {
        const { username, password, email } = req.body

        // Validate Username
        let usernameTaken = await validate__username(username)
        if (usernameTaken)
            return res.status(400).json({ message: 'Username is already taken.' })

        // Validate email
        let emailTaken = await validate__email(email)
        if (emailTaken)
            return res.status(400).json({ message: 'Email is already taken.' })


        //hash password
        const salt = bcrypt.genSaltSync(10);
        const hashed__password = bcrypt.hashSync(password, salt);

        // ===============================================
        // Create a new User
        User.create({ username, email, password: hashed__password })
            .then(user => {
                return res.status(201).json({ ...user, status: true })
            })
            .catch(err => {
                return res.status(400).json({ message: 'Unable to register you account.' })
            })
    } catch (error) {
        return res.status(400).json({ message: "Internal Server Error" })
    }
}

const logout__controller = (req, res) => {
    res.cookie("refresh_token", "", {
        secure: true,
        httpOnly: true,
    }).send("")
}

module.exports = {
    signin__controller,
    signup__controller,
    logout__controller
}