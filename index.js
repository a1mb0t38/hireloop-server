const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require('dotenv').config();
const express = require('express')
const app = express()
const port = process.env.PORT
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
// const dotenv = require('dotenv')
// dotenv.config()

app.use(cors())
app.use(express.json())




const uri = process.env.MONGO_URI

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        const db = client.db("hireloop");
        const jobCollection = db.collection("jobs");

        // getting jobs to forntend
        app.get('/api/jobs', async(req, res)=>{
            const query = {};
            if(req.query.companyId){
                query.companyId = req.query.companyId
            }
            if(req.query.status){
                query.status = req.query.status
            }

            const cursor = jobCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        }) 


        // posting jobs
        app.post('/api/jobs', async (req, res) => {
            const job = req.body;
            const result = await jobCollection.insertOne(job);
            res.send(result);
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Server is running!')
})

app.listen(port, () => {
    console.log(`the server is running on port ${port}`)
})