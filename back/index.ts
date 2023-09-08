import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'
dotenv.config()
import { router } from './routes'

const { PORT } = process.env

const app = express()

app.use(cors())

app.use(express.json())
app.use(router)

app.get('/', (req, res) => {
    return res.status(200).send(`Página Inicial`)
})

app.listen(PORT , () => {
    console.log(`Listening at http://localhost:${PORT}`)
})