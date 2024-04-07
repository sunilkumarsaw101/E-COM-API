//write routes for user

//1.Import express.
import express from "express";

import { UserController } from "./user.controller.js";
import jwtAuth from "../../middlewares/jwt.middleware.js";

//2.Initialize express router.
const router = express.Router();

const userController = new UserController();

//All the paths to controller method.
//localhost:8000/api/users

router.post('/signup', (req, res, next)=>{
    userController.signUp(req, res, next);
});
router.post('/signin', (req, res)=>{
    userController.signIn(req, res);
});

router.put('/resetPassword', jwtAuth,  (req, res)=>{
    userController.resetPassword(req, res);
});

export default router;
