const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const bucket = require("../config/firebase");
const nodeCache = require("node-cache");
const cache = new nodeCache({ stdTTL: 60 * 60 * 1 });

const pharmacyService = require("../services/pharmacy_service");
const optimeService = require("../services/optime_service");

// Get all pharmacies
router.post("/", async (req, res) => {
  const { latitude, longitude } = req.body;
  const authorizationToken = req.headers.authorization;
  try {
    //   Get data from cache
    const cacheResult = cache.get("allPharmacies");
    if (cacheResult != undefined) {
      return res.status(200).json({ data: cacheResult, cache: true });
    }

    const result = await pharmacyService.getAllPharmacies(
      latitude,
      longitude,
      authorizationToken
    );
    cache.set("allPharmacies", result);

    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get pharmacy by name
router.get("/", async (req, res) => {
  const authorizationToken = req.headers.authorization;

  try {
    let result = {};
    if (req.query.latitude && req.query.longitude) {
      result = await pharmacyService.getPharmacyByNameAndDistance(
        req.query.latitude,
        req.query.longitude,
        req.query.name,
        authorizationToken
      );
    } else {
      result = await pharmacyService.getPharmacyByName(
        req.query.name,
        authorizationToken
      );
    }
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pharmacy by id
router.get("/:pharId", async (req, res) => {
  const authorizationToken = req.headers.authorization;
  try {
    const result = await pharmacyService.getPharmacyById(
      req.params.pharId,
      authorizationToken
    );
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get nearest pharmacies
router.post("/nearest", async (req, res) => {
  const { latitude, longitude } = req.body;
  const authorizationToken = req.headers.authorization;
  try {
    //   Get data from cache
    // const cacheResult = cache.get("nearestPharmacies");
    // if (cacheResult != undefined) {
    //   return res.status(200).json({ data: cacheResult, cache: true });
    // }

    const result = await pharmacyService.getNearestPharmacies(
      latitude,
      longitude,
      authorizationToken
    );
    cache.set("nearestPharmacies", result);

    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get operation time of the pharmacy
router.get("/:pharId/optime", async (req, res) => {
  try {
    const result = await optimeService.getOptByPharmacyId(req.params.pharId);
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update pharmacy image by pharmacy id
router.patch("/:pharId/image", upload.single("image"), async (req, res) => {
  const folder = "pharmacy";
  const fileName = `${Date.now()}${req.file.originalname}`;
  const filePath = `${folder}/${fileName}`;
  const fileUpload = bucket.file(filePath);
  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  blobStream.on("error", (error) => {
    res.status(405).json({ error: error.message });
  });

  blobStream.on("finish", async () => {
    try {
      const options = {
        action: "read",
        expires: "12-31-2030",
      };
      var url = await fileUpload.getSignedUrl(options);
      await pharmacyService.updatePharmacyImage(req.params.pharId, url[0]);
      res.status(200).json({ message: "The image has been updated." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  blobStream.end(req.file.buffer);
});

module.exports = router;
