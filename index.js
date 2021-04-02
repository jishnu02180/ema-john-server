const express = require('express')
const app = express()
//require('dotenv').config()
//console.log(process.env.DB_USER);
const bodyParser = require('body-parser');
const cors = require('cors');

const port = 5000;

app.use(bodyParser.json());
app.use(cors());
const MongoClient = require('mongodb').MongoClient;
//const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ayo4r.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const uri = "mongodb+srv://emaWatson:emawatson71@cluster0.ayo4r.mongodb.net/emaJohnStore?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
  app.post('/addProduct',(req,res) =>{
      const product = req.body;
      console.log(product);
      productsCollection.insertOne(product)
      .then(results =>{
          console.log(results.insertedCount);
          res.send(results.insertedCount)
      })
  })

  app.get('/products',(req,res) =>{
    productsCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  })

  app.get('/product/:key',(req,res) =>{
    productsCollection.find({key:req.params.key})
    .toArray((err,documents)=>{
      res.send(documents[0]);
    })
  })

  app.post('/productsByKeys',(req,res) =>{
    const productKeys = req.body;
    productsCollection.find({key: {$in:productKeys}})
    .toArray((err,documents) =>{
      res.send(documents);
    })
  })

  app.post('/addOrder',(req,res) =>{
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(results =>{
        res.send(results.insertedCount > 0)
    })
})


  console.log('db is connected');
});


app.listen(port)