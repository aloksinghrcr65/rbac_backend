const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userPermissionSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    permissions: [{
        permission_name: {
            type: String,
        },
        permission_value: [Number] // 0 => Create, 1 => Read, 2 => Update, 3 => Delete
    }]
});

const UserPermissions = model('UserPermission', userPermissionSchema);
module.exports = UserPermissions;