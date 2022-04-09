// https://github.com/bigmlcom/bigml-node/blob/master/docs/index.md
// https://www.dataem.com/bigml
// Don't run the all code all the time - produce a model ONCE and use for predictions from now on
// Look for an asyc version.

var bigml = require('bigml');
// replace the username and the API KEY of your own
var connection = new bigml.BigML('RaafatMarzuq','2a5da361441e10eaee2258ad814e5f2d764181b0')

var source = new bigml.Source(connection);
source.create('../MongoDB/CSVs/MongoData', function(error, sourceInfo) {
  if (!error && sourceInfo) {
    var dataset = new bigml.Dataset(connection);
    dataset.create(sourceInfo, function(error, datasetInfo) {
      if (!error && datasetInfo) {
        var model = new bigml.Model(connection);
        model.create(datasetInfo, function (error, modelInfo) {
          if (!error && modelInfo) {
            var prediction = new bigml.Prediction(connection);
            prediction.create(modelInfo, {'petal length': 1},function(error, prediction) { console.log(JSON.stringify(prediction));console.log(prediction.code)}); 
          }
        });
      }
    });
  }
});