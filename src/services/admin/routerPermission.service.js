const RouterPermission = require("../../models/router-permission.model");

// Fetch all Express routes
const getAllRoutesService = (app) => {
  const routes = [];

  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods),
      });
    } else if (middleware.name === "router" && middleware.handle.stack) {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          routes.push({
            path: handler.route.path,
            methods: Object.keys(handler.route.methods),
          });
        }
      });
    }
  });

  return routes;
};

// Add or update router permission
const addRouterPermissionService = async ({ router_endpoint, role, permission_id, permission }) => {
  return await RouterPermission.findOneAndUpdate(
    { router_endpoint, role },
    { router_endpoint, role, permission_id, permission },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

// Get router permissions for a specific endpoint
const getRouterPermissionsService = async (router_endpoint) => {
  return await RouterPermission.find({ router_endpoint })
    .populate("permission_id")
    .select("-__v")
    .lean();
};

module.exports = {
  getAllRoutesService,
  addRouterPermissionService,
  getRouterPermissionsService,
};
