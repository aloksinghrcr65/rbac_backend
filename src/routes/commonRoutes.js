const { Router } = require('express');
const router = Router();

const { addCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/common/commonControllers');
const { categoryAddValidator, categoryGetValidator, categoryUpdateValidator, categoryDeleteValidator } = require('../helper/commonValidator');

router.post('/add-category', categoryAddValidator , addCategory);
router.get('/get-categories', getCategories);
router.post('/get-category', categoryGetValidator, getCategoryById);
router.put('/update-category', categoryUpdateValidator, updateCategory);
router.delete('/delete-category', categoryDeleteValidator, deleteCategory);

module.exports = router;