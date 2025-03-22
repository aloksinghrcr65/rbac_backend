const { validationResult } = require("express-validator");
const RouterPermission = require("../../models/RouterPermission");

const getAllRoutes = async (req, res) => {
  try {
    const routes = [];

    req.app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        // Routes registered directly
        routes.push({
          path: middleware.route.path,
          methods: Object.keys(middleware.route.methods),
        });
      } else if (middleware.name === "router" && middleware.handle.stack) {
        // Routes registered through Router
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

    return res.status(200).json({
      success: true,
      message: "All registered routes",
      data: routes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
      error: error.message,
    });
  }
};

const addRouterPermission = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data. Please check your request and try again.",
        errors: errors.array(),
      });
    }

    const { router_endpoint, role, permission } = req.body;
    const routerPermission = await RouterPermission.findOneAndUpdate(
      { router_endpoint, role },
      { router_endpoint, role, permission },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "Router permission added/updated successfully",
      data: routerPermission
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
      error: error.message,
    });
  }
};

const getRouterPermissions = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data. Please check your request and try again.",
        errors: errors.array(),
      });
    }

    const { router_endpoint } = req.body;

    const routerPermissions = await RouterPermission.find({
      router_endpoint
    });

    return res.status(200).json({
      success: true,
      message: "Router Permissions",
      data: routerPermissions
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
      error: error.message,
    });
  }
}
module.exports = { getAllRoutes, addRouterPermission, getRouterPermissions };
