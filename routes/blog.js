const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const Blog = require('../models/blog');

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.resolve('public/uploads'));
    },
    filename: function (req,file,cb){
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null,fileName);
    }
})

const upload = multer({storage});

router.get('/add-new',(req,res)=>{
    return res.render('addBlog',{
        user: req.user
    });
});

router.post('/',upload.single('coverImage'),async (req,res)=>{
    const {title,body} = req.body;
    const blog = await Blog.create({
        title,
        body,
        coverImageURL: `/uploads/${req.file.filename}`,
        createdBy: req.user._id
    });
    return res.redirect(`/blog/${blog._id}`);
})

module.exports = router;