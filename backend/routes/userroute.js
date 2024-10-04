import express from 'express';

import {
    login,
    register,
    test,
    allusers,
    updateuser,
    deleteuser, 
    resetpassword
} from '../controller/usercontroller.js';


import {adminAuthMiddleware} from '../middleware/adminAuthMiddleware.js';

import {userAuthMiddleware} from '../middleware/userAuthMiddleware.js';

const router = express.Router();

router.get("/users",userAuthMiddleware,allusers);

router.post("/login",login);

router.post("/register",register);

router.put("/update/:id",adminAuthMiddleware,updateuser);

router.delete("/delete/:id",adminAuthMiddleware,deleteuser);

router.put('/resetpassword',resetpassword)

router.get("/test",test);

export default router;




