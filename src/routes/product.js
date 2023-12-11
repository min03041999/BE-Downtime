const express = require("express");
const { isAuth } = require("../middleware/is-auth");

const router = express.Router();

const Product = require("../controllers/product");

//GET / product / process status
router.get("/process-status-product", Product.getProcessStatusProduct);

//GET / product / history status
router.get("/history-status-product", Product.getHistoryStatusProduct);

//POST / product / send a request to fix machine
router.post("/send-request-fix-machine", isAuth, Product.sendRequestFixMachine);

//POST / product / cancel send request fix machine
router.post("/cancel-send-request-fix-machine", isAuth, Product.cancelSendRequestFixMachine);


module.exports = router;