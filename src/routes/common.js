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
const { likePost, unlikePost, toggleLikePost, postLikeCount } = require('../controllers/common/like-unlike');
const {
  categoryAddValidator,
  categoryIdValidator,
  categoryUpdateValidator,
  postCreateValidator,
  postIdValidator,
  postUpdateValidator,
  postLikeUnlikeValidator,
  postLikeCountValidator
} = require("../helper/commonValidator");
const {
  createUserValidator,
  userIdValidator,
  updateUserValidator,
  partialUpdateValidator,
} = require("../helper/authValidator");
const { authenticate } = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/checkPermission");

// Category routes
router.post("/add-category", authenticate, checkPermission, categoryAddValidator, addCategory);
router.get("/get-categories", authenticate, checkPermission, getCategories);
router.get("/get-category", authenticate, checkPermission, categoryIdValidator, getCategoryById);
router.put(
  "/update-category",
  authenticate,
  checkPermission,
  categoryUpdateValidator,
  updateCategory
);
router.delete(
  "/delete-category",
  authenticate,
  checkPermission,
  categoryIdValidator,
  deleteCategory
);

// Post routes
router.post("/create-post", authenticate, checkPermission, postCreateValidator, createPost);
router.get("/get-posts", authenticate, getPosts);
router.get("/get-post", authenticate, checkPermission, postIdValidator, getPostById);
router.put("/edit-post", authenticate, checkPermission, postUpdateValidator, editPost);
router.delete("/delete-post", authenticate, checkPermission, postIdValidator, deletePost);

// User routes
router.post("/create-user", authenticate, checkPermission, createUserValidator, createUser);
router.get("/get-users", authenticate, checkPermission, getUsers);
router.get("/get-user", authenticate, checkPermission, userIdValidator, getUserById);
router.put("/update-user", authenticate, checkPermission, updateUserValidator, updateUser); // specific update
router.put(
    "/update-user/:id",
    authenticate,
    checkPermission,
    updateUserValidator,
    updateUserPut
);
router.patch(
    "/update-user/:id",
    authenticate,
    checkPermission,
    partialUpdateValidator,
    updateUserPatch
); // specific update
router.delete("/delete-user", authenticate, checkPermission, userIdValidator, deleteUser);

// Like and Unlike routes
// router.post('/post-like', authenticate, postLikeUnlikeValidator, likePost);
router.post('/post-like', authenticate, checkPermission, postLikeCountValidator, likePost);

// router.post('/post-unlike', authenticate, postLikeUnlikeValidator, unlikePost);
router.post('/post-unlike', authenticate, checkPermission, postLikeCountValidator, unlikePost);

// router.post('/toggle-like', authenticate, postLikeUnlikeValidator, toggleLikePost);
router.post('/toggle-like', authenticate, checkPermission, postLikeCountValidator, toggleLikePost);

router.post('/count-like', authenticate, checkPermission, postLikeCountValidator, postLikeCount);

module.exports = router;
