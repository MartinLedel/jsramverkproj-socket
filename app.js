var app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const stockCalc = require("./stockCalc.js");

const mongo = require('mongodb').MongoClient;
const dsn = 'mongodb://localhost:27017';
const colName = 'stocks';
let stocks = [];

async function findInCollection(dsn, colName, criteria, projection) {
    const client  = await mongo.connect(dsn);
    const db = await client.db();
    const col = await db.collection(colName);
    const res = await col.find(criteria, projection).toArray();

    await client.close();

    return res;
}

async function updateInCollection(dsn, colName, criteria, projection) {
    const client  = await mongo.connect(dsn);
    const db = await client.db();
    const col = await db.collection(colName);
    await col.updateOne(
        criteria,
        projection
    );
    await client.close();
}


io.on('connection', async function(socket) {
    socket.on('stock name', async function (stock) {
        console.info('stock name', stock);

        stocks = await findInCollection(dsn, colName, { stockname: stock.name }, {});
    });

    setInterval(async function () {
        stocks.map((stock) => {
            stock["startingPoint"] = stockCalc.getStockPrice(stock);

            return stock;
        });
        io.emit("stocks", stocks);
        try {
            await updateInCollection(
                dsn,
                colName,
                { name: stocks.name },
                { $set: { startingPoint: stocks.startingPoint } }
            )

        } catch (err) {
            console.log(err);
        }
    }, 5000);
});


console.log("Server up and running on port 8300");
server.listen(8300);
