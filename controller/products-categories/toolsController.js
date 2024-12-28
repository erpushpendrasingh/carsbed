const Tool = require("../../model/products/toolmmodel");

// Create a new tool
const createTool = async (req, res) => {
  const { title, logo } = req.body;

  try {
    // Check if the tool already exists
    const existingTool = await Tool.findOne({ title });
    if (existingTool) {
      return res.status(400).json({ message: "Tool already exists" });
    }

    // Create and save the new tool
    const newTool = new Tool({ title, logo });
    await newTool.save();

    res.status(201).json({ message: "Tool created successfully", tool: newTool });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Get all tools
const getTools = async (req, res) => {
  try {
    const tools = await Tool.find();
    res.status(200).json(tools);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = { createTool, getTools };
