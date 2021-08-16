const express = require('express')
const router = express.Router()
const upload = require('../config/multer')
const bucket = require('../config/firebase')

const productService = require('../services/product_service')

// Get all products
router.get('/', async (req, res) => {
    try {
        const result = await productService.getAllProducts()
        res.status(200).json({ data: result })
    } catch(error) {
    res.status(500).json({ error: error.message })
    }
})

// Get product by id
router.get('/:id', async (req, res) => {
    try {
        const result = await productService.getProductById(req.params.id)
        res.status(200).json({ data: result })
    } catch(error) {
    res.status(500).json({ error: error.message })
    }
})

// Get all product in a given category Id
router.get('/category/:catId', async (req, res) => {
    try {
        const result = await productService.getProductsByCatgoryId(req.params.catId)
        res.status(200).json({ data: result })
    } catch(error) {
    res.status(500).json({ error: error.message })
    }
})

// Get all products associated with a given pharmacy id
router.get('/catalog/:pharId', async (req, res) => {
    try {
        const result = await productService.getProductsByPharmacyId(req.params.pharId)
        res.status(200).json({ data: result })
    } catch(error) {
    res.status(500).json({ error: error.message })
    }
})

// Get all products in a given category associated with a given pharmacy id
router.get('/catalog/:pharId/category/:catId', async (req, res) => {
    const { pharId, catId } = req.params

    try {
        const result = await productService.getProductsByCategoryAndPharmacy(catId, pharId)
        res.status(200).json({ data: result })
    } catch(error) {
    res.status(500).json({ error: error.message })
    }
})

// Add product image by product id
router.post('/:id/image', upload.single('image'), async (req, res) => {
    const folder = 'product'
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
        const result = await productService.insertProductImage(req.params.id, url[0])
        res.status(201).json({ data: result })
      } catch(error) {
        res.status(500).json({ error: error.message })
      }
    });
  
    blobStream.end(req.file.buffer);
})

// Update product image by product id
router.patch('/:imageId/image', upload.single('image'), async (req, res) => {
    const folder = 'product'
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
        await productService.updateProductImage(req.params.imageId, url[0])
        res.status(200).json({ message: "The image has been updated." })
      } catch(error) {
        res.status(500).json({ error: error.message })
      }
    });
  
    blobStream.end(req.file.buffer);
})

// Get product image by product id
router.get('/:id/image', async (req, res) => {
    try {
        const result = await productService.getProdImageByProdId(req.params.id)
        res.status(200).json({ data: result })
    } catch(error) {
    res.status(500).json({ error: error.message })
    }
})

module.exports = router