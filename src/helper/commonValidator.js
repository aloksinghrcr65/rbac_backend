const { check } = require('express-validator');

exports.categoryAddValidator = [
    check('name', 'name is required').not().isEmpty()
];

exports.categoryUpdateValidator = [
    check('id', 'id is required').not().isEmpty(),
    check('name', 'name is required').not().isEmpty()
];

exports.categoryIdValidator = [
    check('id', 'id is required').not().isEmpty()
];

exports.postCreateValidator = [
    check('title', 'title is required').not().isEmpty(),
    check('description', "description is required").not().isEmpty()
];

exports.postIdValidator = [
    check('id', 'id is required').not().isEmpty()
];

exports.postUpdateValidator = [
    check('id', 'id is required').not().isEmpty(),
    check('title', 'name is required').not().isEmpty(),
    check('description', "description is required").not().isEmpty()
];
