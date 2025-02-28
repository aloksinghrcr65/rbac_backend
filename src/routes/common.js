const { Router } = require("express");
const router = Router();

const {
  addCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/common/category");
const {
  createPost,
  getPosts,
  getPostById,
  editPost,
  deletePost,
} = require("../controllers/common/post");
const {
  categoryAddValidator,
  categoryIdValidator,
  categoryUpdateValidator,
  postCreateValidator,
  postIdValidator,
  postUpdateValidator
} = require("../helper/commonValidator");
const { authenticate } = require("../middleware/authMiddleware");

// Category routes
router.post("/add-category", authenticate, categoryAddValidator, addCategory);
router.get("/get-categories", authenticate, getCategories);
router.get("/get-category", authenticate, categoryIdValidator, getCategoryById);
router.put("/update-category", authenticate, categoryUpdateValidator, updateCategory);
router.delete("/delete-category", authenticate, categoryIdValidator, deleteCategory);

// post routes
router.post("/create-post", authenticate, postCreateValidator, createPost);
router.get("/get-posts", authenticate, getPosts);
router.get("/get-post", authenticate, postIdValidator, getPostById);
router.put("/edit-post", authenticate, postUpdateValidator, editPost);
router.delete("/delete-post", authenticate, postIdValidator, deletePost);

module.exports = router;
