//we do two step process for handling the files in backend 
//first we use multer to store the file in the our server(locally)
//then we use cloudinary to take file from local server to its storage 
//then we remove the uploaded file from local server as it is already uploaded in the cloudinary 

import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadonCloudinary = async (localFileUrl) => {
    try {
        if (!localFileUrl) {
            return null
        }
        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFileUrl, {
            resource_type: "auto"//means figure out on your own if it is img or vid////there are multiple thing for whihc u need to chck the documentation
        })

        //file has been uploaded successfully
        console.log("file is uploaded successfully".response.url);
        return response;

    } catch (error) {
        fs.unlinkSync(localFileUrl)//removes the locally saved temporary files as the upload operation got failed 

    }

}

export default uploadonCloudinary