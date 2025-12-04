const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

app.use(cors({
   origin: ["http://localhost:5173", process.env.CLIENT_URL,"https://your-app-name.netlify.app"],
   methods: ["GET", "POST", "PUT", "DELETE"],
   credentials: true
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
