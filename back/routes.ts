import * as express from 'express'
import { validateCSV, updateDB } from './controllers'
import { connectDB, disconnectDB } from './utils'

export const router = express.Router()

router.post('/validate', validateCSV)
router.post('/update', updateDB)
router.post('/connect', connectDB)
router.post('/disconnect', disconnectDB)