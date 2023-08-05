const express = require('express');
const app = express();

require('./db/dbconnection');

const userRouter = require("./routes/userRouter");

                                                // app.post("/signup",userRouter);
app.use(express.urlencoded({extended:true}));
app.use(express.json()); 
                                                // router.use("/user", userRouter);
app.use("/api/v1/user", userRouter);
                                                // app.userRouter("/", userRouter);
app.listen(5000,()=>{
    console.log("server is running on 5000");
});