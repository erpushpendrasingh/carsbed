const express = require("express");
const {
 createAbout,
 updateAbout,
 deleteAbout,
 getAbout,
 getAboutById,
} = require("../../controller/company_profile/about.controller");
const aboutRoutes = express.Router();

aboutRoutes.post("/", createAbout);
aboutRoutes.put("/:id", updateAbout);
aboutRoutes.delete("/:id", deleteAbout);
aboutRoutes.get("/", getAbout);
aboutRoutes.get("/:id", getAboutById);

module.exports = aboutRoutes;
