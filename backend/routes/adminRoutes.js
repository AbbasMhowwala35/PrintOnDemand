const express = require('express');
const {loginAdmin,logout } = require('../controllers/adminAuthController');
const {addCategory,getCategory,updateCategory,deleteCategory } = require('../controllers/categoryController');
const {addMedia,getMedia,updateMedia,deleteMedia} = require('../controllers/mediaController');
const { verifyToken } = require('../middlewares/authAdminMiddleware');
const {upload} = require("../config/multerConfig");
const { validateAdminLogin } = require('../requests/adminRequest');
const { validateCategory } = require('../requests/categoryRequest');
const {validateMedia} = require("../requests/validateMedia");


const router = express.Router();

router.post('/login',validateAdminLogin, loginAdmin);
router.post('/logout',verifyToken,logout);

router.post('/category',verifyToken,validateCategory, addCategory);
router.get('/category',verifyToken, getCategory);
router.patch('/category/:id',verifyToken, updateCategory);
router.delete('/category/:id', verifyToken, deleteCategory);

router.post('/media',upload.single("file"),validateMedia,verifyToken, addMedia);
router.get('/media', getMedia);
router.put("/media/:id", upload.single("file"), verifyToken, updateMedia);
router.delete('/media/:id', verifyToken, deleteMedia);

module.exports = router;
