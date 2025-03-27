const Post = require("../../models/post.model");
const Category = require("../../models/category.model");
const { validationResult } = require("express-validator");

const createPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data. Please check your request and try again.",
        errors: errors.array(),
      });
    }

    const { title, description } = req.body;

    const postObj = {
      title,
      description,
    };

    if (req.body.categories) {
      // Check if provided categories exist in the database
      const existingCategories = await Category.find({
        _id: { $in: req.body.categories },
      });

      if (existingCategories.length !== req.body.categories.length) {
        return res.status(400).json({
          success: false,
          message:
            "Some category IDs do not exist. Please provide valid category IDs.",
        });
      }
      postObj.categories = req.body.categories;
    }

    const post = new Post(postObj);
    const postData = await post.save();

    const postFullData = await Post.findById(postData._id).populate(
      "categories"
    );

    return res.status(201).json({
      success: true,
      message: "Post successfully created",
      post: postFullData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
      error: error.message,
    });
  }
};

const getPosts = async (req, res) => {
  try {
    const allPosts = await Post.find()
      .populate("categories", "name")
      .select("-__v");
    if (!allPosts || allPosts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No any Post found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All Posts fetched successfully",
      posts: allPosts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
      error: error.message,
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data. Please check your request and try again.",
        errors: errors.array(),
      });
    }

    const { id } = req.body;
    const post = await Post.findById(id)
      .populate("categories", "name")
      .select("-__v")
      .lean();
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
      error: error.message,
    });
  }
};

const editPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data. Please check your request and try again.",
        errors: errors.array(),
      });
    }

    const { id, title, description } = req.body;

    const isPostExists = await Post.findById(id);
    if (!isPostExists) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const updatePostObj = {
      title,
      description,
    };

    if (req.body.categories) {
      // Check if provided categories exist in the database
      const existingCategories = await Category.find({
        _id: { $in: req.body.categories },
      });

      if (existingCategories.length !== req.body.categories.length) {
        return res.status(400).json({
          success: false,
          message:
            "Some category IDs do not exist. Please provide valid category IDs.",
        });
      }
      updatePostObj.categories = req.body.categories;
    }

    const postEdit = await Post.findByIdAndUpdate(
      id,
      { $set: updatePostObj },
      { new: true, runValidators: true }
    ).populate({path: "categories",
        select: "name"})
      .select("-__v");

    return res.status(201).json({
      success: true,
      message: "Post Edited Successfully",
      post: postEdit,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
      error: error.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data. Please check your request and try again.",
        errors: errors.array(),
      });
    }

    const { id } = req.body;

    if(!await Post.findByIdAndDelete(id)) {
        return res.status(404).json({
            success: false,
            message: "Post not found"
        })
    };
    
    return res.status(201).json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
      error: error.message,
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  editPost,
  deletePost,
};
