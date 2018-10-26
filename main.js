/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var elasticsearch = require('elasticsearch');
var fs = require('fs');

var xml2js = require('xml2js-parser');
var parser = new xml2js.Parser({explicitRoot:false, strict:false, explicitArray: false});
var Promise = new require('promise');

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

//client.ping({
//  // ping usually has a 3000ms timeout
//  requestTimeout: 1000
//}, function (error) {
//  if (error) {
//    console.trace('elasticsearch cluster is down!');
//  } else {
//    console.log('All is well');
//  }
//});

var listFiles = new Promise(function(fulfill,reject){
    var target = process.cwd()+'/GH95/';
    fs.readdirSync(target).forEach(function(file){
        if(file.indexOf('.sgml') != -1){
            let doc = target+file;
            let data = "<ROOT>\\n"+fs.readFileSync(doc, "utf8")+"\\n</ROOT>";
            parser.parseString(data)
                    .then(function(res){
                        if(res === null) reject("null exception");
                        else {
                            client.bulk({
                                body:res["DOC"]
                            },function(err, resp){
                                if(err) reject(err);
                                else console.log(resp);
                            });
                        }
                    },function(err){
                        reject(err);
                    });
        }
    });
    fulfill("Fim");
});

listFiles.then(function(files){
    console.log(files);
},function(err){
    console.log(err);
});