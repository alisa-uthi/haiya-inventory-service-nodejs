const express = require('express')
const router = express.Router()

const optimeService = require('../services/optime_service')

router.get('/:pharId', async (req, res) => {
    try {
        const result = await optimeService.getOptByPharmacyId(req.params.pharId)
        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router