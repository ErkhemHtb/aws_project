const express = require("express");
const router = express.Router();
const path = require('path');



router.get("/",(req,res)=>{
    const token = req.cookies.token;
    if (!token) {
        res.redirect("/login")
    }
    res.sendFile(path.join(__dirname, "../views/Post.html"));

})

module.exports = router;