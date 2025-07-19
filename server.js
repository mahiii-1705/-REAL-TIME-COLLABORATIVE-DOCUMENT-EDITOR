const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const uri = "mongodb+srv://23070649:shreyasmahi@document.uazklbd.mongodb.net/?retryWrites=true&w=majority&appName=Document";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let documentCollection; 
async function connectToMongo() {
  try {
    await client.connect();
    const db = client.db("collab-editor");
    documentCollection = db.collection("documents");

    const existing = await documentCollection.findOne({ _id: "sharedDoc" });
    if (!existing) {
      await documentCollection.insertOne({ _id: "sharedDoc", text: "" });
    }

    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

app.get('/document', async (req, res) => {
  try {
    const doc = await documentCollection.findOne({ _id: "sharedDoc" });
    res.json({ text: doc.text });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

app.post('/document', async (req, res) => {
  const { text } = req.body;
  try {
    await documentCollection.updateOne({ _id: "sharedDoc" }, { $set: { text } });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update document' });
  }
});

app.listen(PORT, async () => {
  await connectToMongo();
  console.log(`Server is running on http://localhost:${PORT}`);
});
