const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const permissionSchema = new Schema({
    permission_name: {
        type: String,
        required: true,
        unique: true,
    },
    is_default: {
        type: Number, // 0 => Not default, 1 => Default
        default: 1
    }
});

const Permission = model('Permission', permissionSchema);
module.exports = Permission;