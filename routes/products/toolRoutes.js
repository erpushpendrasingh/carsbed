const express = require("express");
const { createTool, getTools } = require("../../controller/products-categories/toolsController");
const toolRoutes = express.Router();
// const { createTool, getTools } = require("../controllers/toolController");

// Route to create a new tool
toolRoutes.post("/", createTool);

// Route to get all tools
toolRoutes.get("/", getTools);

module.exports = toolRoutes;
