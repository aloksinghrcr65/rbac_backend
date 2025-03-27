const Like = require("../../models/like.model");
const Post = require("../../models/post.model");
const { validationResult } = require("express-validator");

// const likePost = async (req, res) => {
//   try {
//     // Validate request input
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid input data. Please check your request and try again.",
//         errors: errors.array(),
//       });
//     }

//     const { user_id, post_id } = req.body;

//     const postExists = await Post.findById(post_id);
//     if (!postExists) {
//       return res.status(404).json({
//         success: false,
//         message: "This post isn't available. It may have been deleted.",
//       });
//     }

//     // Check if the like already exists
//     const isLiked = await Like.findOne({ user_id, post_id });

//     if (isLiked) {
//       return res.status(409).json({
//         success: false,
//         message: "You've already liked this post.",
//       });
//     }

//     await Like.create({ user_id, post_id });

//     return res.status(201).json({
//       success: true,
//       message: "You liked this post.",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong. Please try again later.",
//       error: error.message,
//     });
//   }
// };

const likePost = async (req, res) => {
  try {
    // Validate request input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data. Please check your request and try again.",
        errors: errors.array(),
      });
    }

    const { post_id } = req.body;
    const user_id = req.user.id;

    const postExists = await Post.findById(post_id);
    if (!postExists) {
      return res.status(404).json({
        success: false,
        message: "This post isn't available. It may have been deleted.",
      });
    }

    // Check if the like already exists
    const isLiked = await Like.findOne({ user_id, post_id });

    if (isLiked) {
      return res.status(409).json({
        success: false,
        message: "You've already liked this post.",
      });
    }

    await Like.create({ user_id, post_id });

    return res.status(201).json({
      success: true,
      message: "You liked this post.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
      error: error.message,
    });
  }
};

// const unlikePost = async (req, res) => {
//   try {
//     // Validate request input
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid input data. Please check your request and try again.",
//         errors: errors.array(),
//       });
//     }

//     const { user_id, post_id } = req.body;
//     const postExists = await Post.findById(post_id);
//     if (!postExists) {
//       return res.status(404).json({
//         success: false,
//         message: "This post isn't available. It may have been deleted.",
//       });
//     }

//     const isLiked = await Like.findOne({ user_id, post_id });
//     if (!isLiked) {
//       return res.status(404).json({
//         success: false,
//         message: "You haven’t liked this post yet.",
//       });
//     }

//     await Like.deleteOne({ user_id, post_id });

//     return res.status(200).json({
//       success: true,
//       message: "You unliked this post.",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong. Please try again later.",
//       error: error.message,
//     });
//   }
// };

// Toggle like - unlike using single api

const unlikePost = async (req, res) => {
  try {
    // Validate request input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data. Please check your request and try again.",
        errors: errors.array(),
      });
    }

    const { post_id } = req.body;
    const user_id = req.user.id;

    const postExists = await Post.findById(post_id);
    if (!postExists) {
      return res.status(404).json({
        success: false,
        message: "This post isn't available. It may have been deleted.",
      });
    }

    const isLiked = await Like.findOne({ user_id, post_id });
    if (!isLiked) {
      return res.status(404).json({
        success: false,
        message: "You haven’t liked this post yet.",
      });
    }

    await Like.deleteOne({ user_id, post_id });

    return res.status(200).json({
      success: true,
      message: "You unliked this post.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
      error: error.message,
    });
  }
};

// const toggleLikePost = async (req, res) => {
//   try {
//     // validate request input
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid input data. Please check your request and try again.",
//         errors: errors.array(),
//       });
//     }

//     const { user_id, post_id, action } = req.body; // action is optional

//     const isPostExists = await Post.findById(post_id);
//     if (!isPostExists) {
//       return res.status(404).json({
//         success: false,
//         message: "This post isn't available. It may have been deleted.",
//       });
//     }

//     const isLiked = await Like.findOne({ user_id, post_id });

//     if (isLiked) {
//       if (action === "like") {
//         return res.status(409).json({
//           success: false,
//           message: "You've already liked this post.",
//         });
//       }
//       // Unlike the post if no specific action is given (toggle case)
//       await Like.deleteOne({ post_id, user_id });

//       return res.status(200).json({
//         success: true,
//         message: "You unliked this post",
//       });
//     }

//     // If the user double-clicks, ensure it only likes (handled by frontend)
//     if (action === "unlike") {
//       return res.status(409).json({
//         success: false,
//         message: "You haven't liked this post yet.",
//       });
//     }

//     await Like.create({ user_id, post_id });
//     return res.status(201).json({
//       success: true,
//       message: "You liked this post.",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong. Please try again later.",
//       error: error.message,
//     });
//   }
// };

const toggleLikePost = async (req, res) => {
  try {
    // validate request input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data. Please check your request and try again.",
        errors: errors.array(),
      });
    }

    const { post_id, action } = req.body; // action is optional
    const user_id = req.user.id;

    const isPostExists = await Post.findById(post_id);
    if (!isPostExists) {
      return res.status(404).json({
        success: false,
        message: "This post isn't available. It may have been deleted.",
      });
    }

    const isLiked = await Like.findOne({ user_id, post_id });

    if (isLiked) {
      if (action === "like") {
        return res.status(409).json({
          success: false,
          message: "You've already liked this post.",
        });
      }
      // Unlike the post if no specific action is given (toggle case)
      await Like.deleteOne({ post_id, user_id });

      return res.status(200).json({
        success: true,
        message: "You unliked this post",
      });
    }

    // If the user double-clicks, ensure it only likes (handled by frontend)
    if (action === "unlike") {
      return res.status(409).json({
        success: false,
        message: "You haven't liked this post yet.",
      });
    }

    await Like.create({ user_id, post_id });
    return res.status(201).json({
      success: true,
      message: "You liked this post.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
      error: error.message,
    });
  }
};

const postLikeCount = async (req, res) => {
  try {
    // validate request input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data. Please check your request and try again.",
        errors: errors.array(),
      });
    }

    const { post_id } = req.body;

    const isPostExists = await Post.findById(post_id);
    if (!isPostExists) {
      return res.status(404).json({
        success: false,
        message: "This post isn't available. It may have been deleted.",
      });
    }

    const likeCount = await Like.find({ post_id }).countDocuments();

    return res.status(200).json({
      success: true,
      message: "Post like count",
      count: likeCount
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
      error: error.message,
    });
  }
};

module.exports = { likePost, unlikePost, toggleLikePost, postLikeCount };
