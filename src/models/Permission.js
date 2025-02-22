const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const PermissionSchema = new Schema({
    permissionsName: {
        type: String,
        required: true,
        unique: true,
    },
    is_default: {
        type: Number, // 0 => Not default, 1 => Default
        default: 1
    }
});