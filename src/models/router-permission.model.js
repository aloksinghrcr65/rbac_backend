const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const routerPermissionSchema = new Schema({
    router_endpoint: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: Number, // 0, 1, 2, 3
    },
    permission_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
        required: true
    },
    permission: {
        type: Array // 0, 1, 2, 3
    }
});

const RouterPermission = model('RouterPermission', routerPermissionSchema);
module.exports = RouterPermission;