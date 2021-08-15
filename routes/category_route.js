const express = require('express')
const router = express.Router()
const categoryService = require('../services/category_service')

// Get all categories
router.get('/', async (req, res) => {
    try {
        const result = await categoryService.getAllCategories()
        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router