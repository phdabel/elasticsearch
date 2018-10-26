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

fs.readFile('./GH95/950102.sgml', 'utf8', function(err, data){
    parser.parseString(data)
            .then(function(res){
                console.log(res);
            },function(err){
                console.log(err);
            });
});