const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userPermissionSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    permissions: {
        permission_name: {
            type: String,
            required: true
        },
        permission_value: [Number]
    }
});

const UserPermissions = model('UserPermission', userPermissionSchema);
module.exports = UserPermissions;