import express from "express";

import { signup, login, adminLogin } from "../controllers/Authcontrollers.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/admin", adminLogin);

export default router;
