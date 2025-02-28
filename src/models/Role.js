const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const RoleSchema = new Schema({
    roleName: {
        type: String,
        required: true,
        unique: true,
    },
    value: {
        type: Number,
        required: true,
        unique: true,
    }
});

const Role = model('Role', RoleSchema);
module.exports = Role;