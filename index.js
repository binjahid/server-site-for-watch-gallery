const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;
require("dotenv").config();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0mdbb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//watchGalleryDB
//3GNX4rTnl5d1IhDU

async function run() {
  try {
    await client.connect();
    const database = client.db("Watch-Gallery");
    const itemsCollection = database.collection("Items");
    const usersCollection = database.collection("users");
    const ordersCollection = database.collection("orders");
    const reviewsCollection = database.collection("reviews");
    //Get all items
    app.get("/items", async (req, res) => {
      const items = await itemsCollection.find({}).toArray();
      res.json(items);
    });
    //find item by id
    app.get("/items/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const item = await itemsCollection.findOne(query);
      res.json(item);
    });
    app.post("/users/info", async (req, res) => {
      const user = req.body;
      // console.log(user);
      const result = await usersCollection.insertOne(user);
      res.json(result);
      // res.json(user);
    });
    //check is admin
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
      console.log(user);
    });
    //place order
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      res.json(result);
    });
    //get all orders
    app.get("/addOrders", async (req, res) => {
      const orders = await ordersCollection.find({}).toArray();
      res.json(orders);
    });

    //get orders based email
    app.get("/orders/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = { email: email };
      const orders = await ordersCollection.find(query).toArray();
      res.json(orders);
    });
    console.log("Connected to MongoDB");
    //post Comment
    app.post("/comments", async (req, res) => {
      const comment = req.body;
      const result = await reviewsCollection.insertOne(comment);
      res.json(result);
    });
    //dele a order
    app.delete("/orders/delete/:id", async (req, res) => {
      const order = req.params.id;
      const query = { _id: ObjectId(order) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
    });
    //inset new item
    app.post("/items", async (req, res) => {
      const item = req.body;
      console.log(item);
      const result = await itemsCollection.insertOne(item);
      res.json(result);
      console.log(result);
    });
    //make an use Admin
    app.put("/users/admin/:email", async (req, res) => {
      const user = req.params.email;
      console.log(user);
      const query = { email: user };
      const update = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(query, update);
      res.json(result);
      console.log(result);
    });
  } finally {
    // client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
