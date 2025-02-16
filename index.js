const express = require('express')
const cors = require('cors')
const db = require('./db/db')
const app = express()
require('dotenv').config()
const port =process.env.PORT|| 3000
app.use(express.json())
app.use(cors())
// db config import
db


const userRoute=require('./routes/userRoute')
const taskRoute=require('./routes/taskRoute')

app.use('/api/v1/user',userRoute)
app.use('/api/v1/task',taskRoute)




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
