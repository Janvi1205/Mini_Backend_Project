import "dotenv/config"; //always keep this at top coz i faced the issue as my cloudinary connection was failing 
                        // as i was having my cloudinay credential in env file and it was loading after app.js  and it below app.js import

import connectdb from "./db/db.js";
import app from "./app.js";

connectdb()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`server is running at port ${process.env.PORT || 8000}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB Connection failed", error);
    });