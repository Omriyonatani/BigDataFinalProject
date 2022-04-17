const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = "mongodb+srv://raafat:eRcywty8yYOG6s9q@cluster0.phfg8.mongodb.net/CallCenter?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const { Parser } = require('json2csv');
var fs = require('fs');


async function insertToMongoDB(data){
  // Connect to our MongoDB's collection
  client.connect(err => {
    if (err) throw err;
    const collection = client.db("CallCenter").collection("Customers");
  });
  // Connect + Insert to the MongoDB
  client.connect(async function(err, db) {
    data = JSON.parse(data)
    if (err) throw err;
    var dbo = db.db("CallCenter");
    dbo.collection("Customers").insertOne(data, function(err, res) {
      if (err) throw err;
    }); 
  });
}

// Function that exports the data to CSV (for BigML)
function exportToCsv(){
  client.connect(function(err, db) {
    if (err) throw err;
    var dbo = db.db("CallCenter");
    var query = { };
    dbo.collection("Customers").find(query).toArray(function(err, result) {
      if (err) throw err;
      var fields = ['phoneNumber', 'id', 'city', 'gender', 'age', 'prevCalls','topic','Product','totalTime','totalCalls','season'];
      const opts = { fields };
      try {
        const parser = new Parser(opts);
        const csv = parser.parse(result);
        var path='../bigML/MongoData.csv';
        fs.writeFile(path, csv, function(err,data) {
            if (err) {throw err;}
            
        });
      } catch (err) {
        console.error(err);
      }
      db.close();
    });
  });
}

module.exports.insertToMongoDB = insertToMongoDB;
module.exports.exportToCsv = exportToCsv;