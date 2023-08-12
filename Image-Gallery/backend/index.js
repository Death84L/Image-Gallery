const express = require("express");
const app = express();
const cors = require("cors");
const mongoose=require("mongoose");

app.use(cors());
app.use(express.json());

//database connection
const mongoDBURL = 'mongodb://0.0.0.0:27017/TechSurf';

mongoose.connect(mongoDBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB successfully!');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});




// Route Import
const user = require("./Routes/userRoute");
app.use("/api", user);
const image = require("./Routes/imageRoute");
app.use('/api/images', image);

app.get('/hello',(req,res)=>{
    res.send("hello world"); 
})

const server = app.listen(5000, () => {
    console.log(`Server is working on http://localhost:${5000}`);
  });