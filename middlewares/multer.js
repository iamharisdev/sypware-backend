const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
 destination: function (_req, _file, cb) {
  cb(null, "uploads");
 },
 filename: function (_req, file, cb) {
  cb(null, Date.now() + path.extname(file.originalname));
 },
});

const upload = multer({storage: storage});

module.exports = upload;
