import express from 'express';
import {MongoClient} from 'mongodb';
import bodyparser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3000;
const uri = "mongodb+srv://user_sai:12151@democluster.pxgddik.mongodb.net/?retryWrites=true&w=majority&appName=DemoCluster";
const client = new MongoClient(uri);
const db = client.db("SecurityBoat");
const collection = db.collection("user_info");

app.use(express.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(cors());

app.post("/add/user",async(req,res)=>{
    const arr = {};
    console.log(req.body);
   try{
    await client.connect();
       const result = await collection.find({}).toArray();
       const response =  result[0].categories[1].users;
       let status = "";
       response.forEach(element => {
          if(element.email == req.body.email){
            status = "duplicate";
            res.json("user already exists");
          }
       });
       if(status != "duplicate"){
        arr.id = response.length + 1;
        arr.name = req.body.name ,
        arr.type = req.body.type,
        arr.email = req.body.email,
        arr.phone = req.body.phone,
        arr.password = req.body.password,
        arr.bookings = []
        const adduser = await collection.updateOne({}, { $push: { "categories.$[c].users": arr } }, { arrayFilters: [{ "c.category_name": "users" }] });
        res.json(adduser);
        if(adduser){
         console.log(adduser)
        }else{
         console.log("error");
        }
       }
   }catch(err){
    console.log(err)
   }
  })


  app.post("/add/movielist",async(req,res)=>{
    const arr = {};
    console.log(req.body);
   try{
    await client.connect();
       const movielist = await collection.find({}).toArray();
       const response =  movielist[0].categories[0].movielist;
       arr.id = response.length + 1;
       arr.actor = req.body.actor;
       arr.title = req.body.title;
       arr.genre = req.body.genre;
       arr.poster = req.body.poster;
       arr.plot = req.body.plot;
       arr.duration = req.body.duration;
       const addmovie = await collection.updateOne({}, { $push: { "categories.$[c].movielist": arr } }, { arrayFilters: [{ "c.category_name": "movies" }] });
       res.json(addmovie);
       if(addmovie){
        console.log(addmovie)
       }else{
        console.log("error");
       }
   }catch(err){
    console.log(err)
   }
  })
  

  app.post("/check/user",async(req,res)=>{
   try{
    await client.connect();
       const result = await collection.find({}).toArray();
       const response =  result[0].categories[1].users;
       let isValidUser = false;
       response.forEach(element => {
          if(element.email == req.body.email && element.password == req.body.password){
            isValidUser = true;
          }
       });    
       if (isValidUser) {
        res.json("Valid user");
    } else {
        res.json("Invalid user");
    }  
   }catch(err){
    console.log(err)
   }
  })

  app.get("/userDetails",async(req,res)=>{
    try{
      await client.connect(); 
      const response = await collection.find({}).toArray();
      res.json(response[0].categories[1].users);
    }catch(err){
       console.log(err);
    }
   })

   app.get("/MovieDetails",async(req,res)=>{
    try{
      await client.connect(); 
      const response = await collection.find({}).toArray();
      res.json(response[0].categories[0].movielist);
    }catch(err){
       console.log(err);
    }
   })




app.listen(port,()=>{
    console.log("listening");
})

