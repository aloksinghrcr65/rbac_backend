const { Router } = require('express');
const router = Router();

const { addCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/common/commonControllers');
const { categoryAddValidator, categoryGetValidator, categoryUpdateValidator, categoryDeleteValidator } = require('../helper/commonValidator');
const { authenticate } = require('../middleware/authMiddleware');


router.post('/add-category', authenticate, categoryAddValidator , addCategory);
router.get('/get-categories', authenticate, getCategories);
router.get('/get-category', authenticate, categoryGetValidator, getCategoryById);
router.put('/update-category', authenticate, categoryUpdateValidator, updateCategory);
router.delete('/delete-category', authenticate, categoryDeleteValidator, deleteCategory);

module.exports = router;