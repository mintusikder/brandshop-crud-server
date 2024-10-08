const express = require("express");
const cors = require("cors");

//config
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rmmjiwd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)

    const shopCollection = client.db("shopDB").collection("shop");

    app.get("/shops", async (req, res) => {
      const curser = shopCollection.find();
      const result = await curser.toArray();
      res.send(result);
    });
    app.post("/shops", async (req, res) => {
      const shop = req.body;
      const result = await shopCollection.insertOne(shop);
      res.send(result);
    });
    
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Brand shop running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
