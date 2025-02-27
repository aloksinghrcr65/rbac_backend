const { check } = require('express-validator');

exports.categoryAddValidator = [
    check('name', 'name is required').not().isEmpty()
];

exports.categoryGetValidator = [
    check('id', 'id is required').not().isEmpty()
];

exports.categoryUpdateValidator = [
    check('id', 'id is required').not().isEmpty(),
    check('name', 'name is required').not().isEmpty()
];

exports.categoryDeleteValidator = [
    check('id', 'id is required').not().isEmpty()
];