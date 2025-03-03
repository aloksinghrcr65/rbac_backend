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
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateUserPut,
  updateUserPatch,
  deleteUser
} = require("../controllers/common/user");
const {
  categoryAddValidator,
  categoryIdValidator,
  categoryUpdateValidator,
  postCreateValidator,
  postIdValidator,
  postUpdateValidator,
} = require("../helper/commonValidator");
const {
  createUserValidator,
  userIdValidator,
  updateUserValidator,
  partialUpdateValidator,
} = require("../helper/authValidator");
const { authenticate } = require("../middleware/authMiddleware");

// Category routes
router.post("/add-category", authenticate, categoryAddValidator, addCategory);
router.get("/get-categories", authenticate, getCategories);
router.get("/get-category", authenticate, categoryIdValidator, getCategoryById);
router.put(
  "/update-category",
  authenticate,
  categoryUpdateValidator,
  updateCategory
);
router.delete(
  "/delete-category",
  authenticate,
  categoryIdValidator,
  deleteCategory
);

// Post routes
router.post("/create-post", authenticate, postCreateValidator, createPost);
router.get("/get-posts", authenticate, getPosts);
router.get("/get-post", authenticate, postIdValidator, getPostById);
router.put("/edit-post", authenticate, postUpdateValidator, editPost);
router.delete("/delete-post", authenticate, postIdValidator, deletePost);

// User routes
router.post("/create-user", authenticate, createUserValidator, createUser);
router.get("/get-users", authenticate, getUsers);
router.get("/get-user", authenticate, userIdValidator, getUserById);
router.put("/update-user", authenticate, updateUserValidator, updateUser); // specific update
router.put(
    "/update-user/:id",
    authenticate,
    updateUserValidator,
    updateUserPut
);
router.patch(
    "/update-user/:id",
    authenticate,
    partialUpdateValidator,
    updateUserPatch
); // specific update
router.delete("/delete-user", authenticate, userIdValidator, deleteUser);

module.exports = router;
