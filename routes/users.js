const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/cool", (req, res) => {
  res.send("You are so cool!!!!!!1")
})
module.exports = router;