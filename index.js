const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose');
const authRoute = require('./routes/authRoute');
const booksRoute = require('./routes/booksRoute');


const cors__options = {
    origin: 'https://musing-noether-ca656e.netlify.app',
    credentials: true,            //access-control-allow-credentials:true
}
require('dotenv').config()

// PORT
const PORT = process.env.PORT || 6000;

//Middlewares
app.use(cors(cors__options));
app.use(morgan('tiny'));
app.use(express.json())

//Routes
app.use('/auth', authRoute)
app.use('/books', booksRoute);

// mongodb connection
mongoose
    .connect(
        require('./config').uri,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )
    .then(_ => console.log("Mongodb connected"))
    .catch(err => console.log("Mongodb not connected"));

// Server 
app.listen(6000, () => console.log("Port started on 6000!"))
