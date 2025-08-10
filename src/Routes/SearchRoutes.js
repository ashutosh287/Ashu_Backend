const express = require("express");
const router = express.Router();
const { searchShops , getProductsByShop } = require('../Controller/SearchShop');

router.get("/search/shops", searchShops);
router.get("/search/live-search/:shopId", getProductsByShop);


module.exports = router;
