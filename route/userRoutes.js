const express=require('express')
const router=express.Router()
const{register,login,forgotPassword,resetPassword}=require('../controllers/userControllers')
const{verifyToken}=require('../middlewares/authMiddleware')
router.post('/register',register)
router.post('/login',login)
router.post('/forgot-password',forgotPassword)
router.post('/reset-password/:token',resetPassword)
router.get('/userinfo',verifyToken,(req,res)=>{
    res.json({message:'protected router',user:req.user})
})
module.exports=router;
