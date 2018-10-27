// módulo file system
var fs = require('fs');
// módulo Model
var ElasticSearchConnection = require('./connector/connector.js');
// xml parser
var xml2js = require('xml2js-parser');
// inicialização do xml parser
var parser = new xml2js.Parser({explicitRoot:false, strict:false, explicitArray: false});
//promises
var Promise = new require('promise');
// conexão com o Elastic Search
var conn = new ElasticSearchConnection();
// localização dos arquivos
var target = process.cwd()+'/GH95/';


fs.readdirSync(target).forEach(function(file){
    if(file.indexOf('950102.sgml') != -1){
        let doc = target+file;
        let data = "<ROOT>\\n"+fs.readFileSync(doc, "utf8")+"\\n</ROOT>";
        parser.parseString(data)
            .then(function(res){
                if(res === null) console.log("null exception");
                else {
                    console.log(res["DOC"].length);
                    console.log(res["DOC"][0]["DOCID"]);
                    console.log((res["DOC"][0]["DATE"]));
                    let y = (res["DOC"][0]["DATE"]).substring(0,2);
                    let m = (res["DOC"][0]["DATE"]).substring(2,4);
                    let d = (res["DOC"][0]["DATE"]).substring(4,6);
                    var date = new Date();
                    date.setDate(d);
                    date.setMonth(m-1);
                    date.setFullYear(y)
                    console.log(date);
//                        client.bulk({
//                            body:res["DOC"]
//                        },function(err, resp){
//                            if(err) reject(err);
//                            else console.log(resp);
//                        });
                }
            },function(err){
                console.log(err);
            });
    }
});