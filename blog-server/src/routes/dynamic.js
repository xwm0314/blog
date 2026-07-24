const express = require('express')
const router = express.Router()
const dynamicController = require('../controllers/dynamicController')
const authMiddleware = require('../middleware/auth')

router.post('/', authMiddleware, dynamicController.createDynamic)
router.get('/', authMiddleware, dynamicController.getDynamics)
router.get('/published', dynamicController.getDynamics)
router.get('/published/:id', dynamicController.getDynamicById)
router.get('/:id', authMiddleware, dynamicController.getDynamicById)
router.delete('/:id', authMiddleware, dynamicController.deleteDynamic)

module.exports = router