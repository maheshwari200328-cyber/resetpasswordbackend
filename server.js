const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
  "https://passwordresetnavi30.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      process.env.CLIENT_URL,
      "https://passwordresetnavi30.netlify.app",
    ];

    if (!origin) return callback(null, true); // Postman, server-to-server

    if (allowedOrigins.some(o => origin.startsWith(o))) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
}));


app.use(express.json())

app.get("/", (req, res) => {
  res.send("Backend is working!");
});

app.use('/api', require('./route/userRoutes'))

mongoose.connect(process.env.URL)
  .then(() => console.log("Mongodb connected"))
  .catch(err => console.log(err))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
