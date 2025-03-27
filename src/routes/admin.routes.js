const { Router } = require("express");
const router = Router();

const {
  permissionAddValidator,
  permissionUpdateValidator,
  permissionDeleteValidator,
  roleAddValidator,
  addRouterPermissionValidator,
  getRouterPermissionsValidator,
} = require("../helper/validators/admin.validator");
const { authenticate } = require("../middleware/auth.middleware");
const { onlyAdminAccess } = require("../middleware/admin.middleware");
const {
  addPermission,
  getPermissions,
  updatePermission,
  deletePermission,
} = require("../controllers/admin/permission.controller");
const { createRole, getRoles } = require("../controllers/admin/role.controller");
const {
  addRouterPermission,
  getRouterPermissions,
} = require("../controllers/admin/router.controller");

// Permission Routes
router.post(
  "/add-permission",
  authenticate,
  onlyAdminAccess,
  permissionAddValidator,
  addPermission
);
router.get("/get-permissions", authenticate, onlyAdminAccess, getPermissions);
router.put(
  "/update-permission",
  authenticate,
  onlyAdminAccess,
  permissionUpdateValidator,
  updatePermission
);
router.delete(
  "/delete-permission/:id?",
  authenticate,
  onlyAdminAccess,
  permissionDeleteValidator,
  deletePermission
);

// Role Routes
router.post(
  "/create-role",
  authenticate,
  onlyAdminAccess,
  roleAddValidator,
  createRole
);
router.get(
  "/get-roles",
  authenticate,
  onlyAdminAccess,
  roleAddValidator,
  getRoles
);

// Router Permission routes
router.post(
  "/add-router-permission",
  authenticate,
  onlyAdminAccess,
  addRouterPermissionValidator,
  addRouterPermission
);

router.get(
  "/get-router-permissions",
  authenticate,
  onlyAdminAccess,
  getRouterPermissionsValidator,
  getRouterPermissions
);

module.exports = router;
