const mongoose=require("mongoose");
const dotenv=require("dotenv");
dotenv.config({ path: "./config.env"});

const app=require("./app");


process.on("uncaughtException", err => {
    console.log("ERROR: UNCAUGHT EXCEPTION");
    console.error(err.name, ": ", err.message);
    process.exit(1);
})

const DB=process.env.DATABASE.replace("<password>",process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Connection Established!!!");
})

const port_no=process.env.PORT || 5000;
const server=app.listen(port_no,()=>{
    console.log("App is running under port 5000 \nWaiting for requests...");
})

process.on("unhandledRejection", err => {
    console.log("ERROR: UNHANDLED REJECTION");
    console.error(err.name, ": ", err.message);
    server.close(() => {
        process.exit(1);
    })
});