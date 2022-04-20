// https://github.com/bigmlcom/bigml-node/blob/master/docs/index.md
// https://www.dataem.com/bigml
// Don't run the all code all the time - produce a model ONCE and use for predictions from now on
// Look for an asyc version.

var bigml = require('bigml');


// replace the username and the API KEY of your own
function createModel(){
  var connection = new bigml.BigML('RaafatMarzuq','2a5da361441e10eaee2258ad814e5f2d764181b0')
  var source = new bigml.Source(connection);
  source.create('./MongoData.csv', function(error, sourceInfo) {
    if (!error && sourceInfo) {
      var dataset = new bigml.Dataset(connection);
      dataset.create(sourceInfo, function(error, datasetInfo) {
        if (!error && datasetInfo) {
          var model = new bigml.Model(connection);
          model.create(datasetInfo,{ 'objective_field': "000006" }, function (error, modelInfo) {
            if (!error && modelInfo) {
              console.log("\nModel number = " + modelInfo.resource);
            }
          
          });
        }
      });
    }
  });
}


async function predictTopic(city,gender,age,prevCalls,Product){
  return await new Promise( res =>{
    var connection = new bigml.BigML('RaafatMarzuq','2a5da361441e10eaee2258ad814e5f2d764181b0')
    var source = new bigml.Source(connection);
    source.create('../bigML/MongoData.csv',true, async function(error, sourceInfo) {
      if(error) throw error;
      if (!error && sourceInfo) {
        var dataset = new bigml.Dataset(connection);
        dataset.create(sourceInfo, async function(error, datasetInfo) {
          if(error) throw error;
          if (!error && datasetInfo) {
          var predictionInput= {
          city:city,
          gender : gender,
          age:age,
          prevCalls: prevCalls,
          Product: Product
        }
        var prediction =  new bigml.Prediction(connection);
        
        prediction.create('model/625acee2049fde5d94001586',predictionInput, async function(error, prediction) {
          if(error) throw error;
          
          var predictedTopic=  {
            report: await prediction.object.probabilities[0][1]*100,
            join:await prediction.object.probabilities[1][1]*100,
            disconnect:await prediction.object.probabilities[2][1]*100,
            service: await prediction.object.probabilities[3][1]*100,
            output:await prediction.object.output
          };
          // console.log(predictedTopic)
          res(predictedTopic)    
        });
      }
    });
    }
  });
}) 
}

async function GetPred(city,gender,age,prevCalls,produce){
  var ans = await predictTopic(city,gender,age,prevCalls,produce);
  return ans;
}


// GetPred("Raanana","male","2","28","Internet");
// module.exports.predictTopic= predictTopic;
module.exports.GetPred = GetPred;
module.exports.createModel=createModel;