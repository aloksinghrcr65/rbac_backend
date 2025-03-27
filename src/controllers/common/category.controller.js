const Category = require('../../models/category.model');
const { validationResult } = require('express-validator');

const addCategory = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
           return res.status(400).json({
                success: false,
                message: "Invalid input data. Please check your request and try again.",
                errors: errors.array(),
           });
        }

        const { name } = req.body;
        const category = await Category.findOne({ name: {
            $regex: name,
            $options: 'i'
        } });

        // const category = await Category.findOne({
        //     name: new RegExp(`^${name}$`, 'i') // Matches exact name (case-insensitive)
        // });
        
        if (category) {
            return res.status(409).json({
                success: false,
                message: "Category name already exist"
            })
        }

        const categoryObj = {
            name
        }

        const categoryData = new Category(categoryObj);
        const addCategoryData = await categoryData.save();

        return res.status(201).json({
            success: true,
            message: "Category added successfully",
            data: addCategoryData
        });

    } catch (error) {
        console.error(">>>>>>>>>>", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later"
        })
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().select('-__v').lean();
        if (!categories || categories.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No any Category found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            categories
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};

const getCategoryById = async (req, res) => {
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

        const { id } = req.body;

        const category = await Category.findById(id).select('-__v').lean();
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            data: category
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later.",
            error: error.message
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Invalid input data. Please check your request and try again.",
                errors: errors.array(),
            });
        }

        const { id, name } = req.body;

        const isCategoryExist = await Category.findById(id);
        if (!isCategoryExist) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        const isNameExist = await Category.findOne({ _id: { $ne: id }, 
            name: {
                $regex: name,
                $options: 'i'
            }
        });

        if(isNameExist) {
            return res.status(409).json({
                success: false,
                message: "Category name already exist"
            })
        }

        const updateCategoryObj = {
            name
        }

        const category = await Category.findByIdAndUpdate(id, { $set: updateCategoryObj }, {
            new: true, runValidators: true
        }).select('-__v');

        return res.status(201).json({
            success: true,
            message: "Category name updated",
            data: category
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later.",
            error: error.message
        })
    }
};

const deleteCategory = async (req, res) => {
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

        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later.",
            error: error.message
        })
    }
};

module.exports = {
    addCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
