import multer from "multer";
 //got the below code from github documentation of multer
const storage=multer.diskStorage({//created a middleware named storage
    destination:function(req,file,cb){ //cb means call back fucn also only multer has file ting that is why we use it 
        cb(null,"./public/temp") //as i want to keep all my files in the public folder 
    },

    filename:function(req,file,cb){
        cb(null,file.originalname) //we can save the name in whaterver way we want but here we are doing that to save the file with  the same name as given by the user (not preferable)
    }
       
})

export const upload=multer({
    storage,
})