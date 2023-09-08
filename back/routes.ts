import * as express from 'express'
import { validateCSV, updateDB } from './controllers'


export const router = express.Router()

router.post('/validate', validateCSV)
router.post('/update', updateDB)
