import express from 'express'
import * as dotenv from "dotenv"
dotenv.config()
const routes = require('routes')

const { PORT } = process.env

const app = express()

app.use(express.json())
app.use(routes)

app.get('/', (req, res) => {
    return res.status(200).send(`Página Inicial`)
})

app.listen(PORT , () => {
    console.log(`Listening at http://localhost:${PORT}`)
})