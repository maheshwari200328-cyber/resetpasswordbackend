const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

app.use(cors({
   origin: "*",
   methods: ["GET", "POST", "PUT", "DELETE"]
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
