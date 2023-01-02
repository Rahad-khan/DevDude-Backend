require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
const colors = require('colors');

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@devdude.dn8voaz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

const run = async () => {
    try {
        const db = client.db("devdude");
        const blogCollection = db.collection("blog");

        app.get("/blogs", async (req, res) => {
            const cursor = blogCollection.find({});
            const blogs = await cursor.toArray();

            res.send({ status: true, data: blogs });
        });
        app.get("/blog/:id", async (req, res) => {
            const { id } = req.params;
            const result = await blogCollection.findOne({
                _id: ObjectId(id)
            });

            res.send({ status: true, data: result });
        });

        app.post("/blog", async (req, res) => {
            const blog = req.body;

            const result = await blogCollection.insertOne(blog);

            res.send(result);
        });

        app.put("/blog/:id", async (req, res) => {
            const id = req.params.id;
            const updateBlog = req.body;

            const result = await blogCollection.updateOne({ _id: ObjectId(id) }, { $set: updateBlog });
            res.send(result);
        });
        app.delete("/blog/:id", async (req, res) => {
            const id = req.params.id;

            const result = await blogCollection.deleteOne({ _id: ObjectId(id) });
            res.send(result);
        });
    } finally {
    }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
    console.log(`DevDude is running on port ${port}`.red);
});
