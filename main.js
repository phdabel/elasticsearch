/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var fs = require('fs');
var Model = require('./model/basemodel.js');

var xml2js = require('xml2js-parser');
var parser = new xml2js.Parser({explicitRoot:false, strict:false, explicitArray: false});
var Promise = new require('promise');

var client = new Model();
//client.ping();
//client.create('test','aaa1',{
//    fist_name : 'abel',
//    last_name : 'correa'
//});

//client.update('test', 'test', 'aaa1', {last_name: 'correa dias'});

client.read('test','test','aaa1');


//var listFiles = new Promise(function(fulfill,reject){
//    var target = process.cwd()+'/GH95/';
//    fs.readdirSync(target).forEach(function(file){
//        if(file.indexOf('950102.sgml') != -1){
//            let doc = target+file;
//            let data = "<ROOT>\\n"+fs.readFileSync(doc, "utf8")+"\\n</ROOT>";
//            parser.parseString(data)
//                    .then(function(res){
//                        if(res === null) reject("null exception");
//                        else {
//                            console.log(res["DOC"].length);
//                            client.bulk({
//                                body:res["DOC"]
//                            },function(err, resp){
//                                if(err) reject(err);
//                                else console.log(resp);
//                            });
//                        }
//                    },function(err){
//                        reject(err);
//                    });
//        }
//    });
//    fulfill("Fim");
//});
//listFiles.then(function(files){
//    console.log(files);
//},function(err){
//    console.log(err);
//});