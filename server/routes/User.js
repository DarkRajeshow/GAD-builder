import express from "express";
import {
    getUserData,
    getUserId,
    loginUser,
    logoutUser,
    registerUser
} from "../controllers/auth.js";
import { getAllDesigns } from "../controllers/design.js";


const router = express.Router();

router.get("/", getUserData);
router.get("/id", getUserId);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);



router.get("/designs", getAllDesigns);

export default router;
