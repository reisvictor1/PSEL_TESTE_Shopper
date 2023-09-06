import * as express from 'express'
const appController = require('controllers.ts')



const router = express.Router()

router.post('/validate', appController.validateCSV)
router.post('/update', appController)

module.exports = router

