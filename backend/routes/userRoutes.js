const express = require('express');
const path = require('path')
const router = express.Router();
const { get_user, upload_profile, fetchUsers } = require('../controllers/userController');
const multer = require('multer')

const storage = multer.diskStorage({
 destination: function (req, file, cb) {
  cb(null, path.join('routes', '..', 'uploads'));
},
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // e.g., '.jpg'
    const nameWithoutExt = path.basename(file.originalname, ext); // "profile"
    cb(null, nameWithoutExt + '-' + Date.now()+ ext)
  }
})
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } })// 5 MB })

//ENDPOINTS
router.post('/upload', upload.single('file'), upload_profile);
router.get('/get-user', get_user)
router.get('/fetchUsers', fetchUsers)


module.exports = router;
