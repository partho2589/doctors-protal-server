const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const cors = require('cors');
const { use } = require('express/lib/router');
require('dotenv').config()
const port = process.env.PORT || 5000

//meddelware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k5foo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('doctors-portal').collection('service')
        const bookingCollection = client.db('doctors-portal').collection('booking')
       
        app.get('/service', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })

        app.post('/booking', async(req, res)=>{
            const booking= req.body;
            const query = {treatment:booking.treatment, date:booking.date, patient:booking.patient}
            const result = await bookingCollection.insertOne(booking);
            res.send(result)
        })

    }
    finally {

    }
}
run().catch(console.dir)
app.get('/', (req, res) => {
    res.send('Hello Doctor portal!')
})

app.listen(port, () => {
    console.log(`Doctor portal listening on port ${port}`)
})