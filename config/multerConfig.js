const multer = require("multer");

const storage =multer.diskStorage({
    filename: function(res,req,cb){
        cb(null,file.originalname)
    }
})
const upload=multer({storage:storage})
module.exports=upload