const express = require('express')
const router = express.Router()
const upload = require('../config/multer')
const bucket = require('../config/firebase')

const pharmacyService = require('../services/pharmacy_service')
const optimeService = require('../services/optime_service')

// Get all pharmacies
router.get('/', async (req, res) => {
    try {
        const result = await pharmacyService.getAllPharmacies()
        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Get nearest pharmacies
router.get('/nearest', async (req, res) => {
    const { latitude, longitude } = req.body
    try {
        const result = await pharmacyService.getNearestPharmacies(latitude, longitude)
        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Get operation time of the pharmacy
router.get('/:pharId/optime', async (req, res) => {
    try {
        const result = await optimeService.getOptByPharmacyId(req.params.pharId)
        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Update pharmacy image by pharmacy id
router.patch('/:pharId/image', upload.single('image'), async (req, res) => {
    const folder = 'pharmacy'
    const fileName = `${Date.now()}${req.file.originalname}`
    const filePath = `${folder}/${fileName}`
    const fileUpload = bucket.file(filePath);
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: req.file.mimetype
      }
    });
   
    blobStream.on('error', (error) => {
      res.status(405).json({ error: error.message });
    });
  
    blobStream.on('finish', async () => {
      try {
        const options = {
          action: 'read',
          expires: '12-31-2030'
        };
        var url = await fileUpload.getSignedUrl(options)
        await pharmacyService.updatePharmacyImage(req.params.pharId, url[0])
        res.status(200).json({ message: "The image has been updated." })
      } catch(error) {
        res.status(500).json({ error: error.message })
      }
    });
  
    blobStream.end(req.file.buffer);
})

module.exports = router