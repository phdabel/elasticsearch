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

/**
 * Recebe o documento parseado para ser indexado como um objeto JSON.
 * 
 * @param {type} res
 * @returns {Promise}
 */
var indexObj = function(res){
    return new Promise(function(fulfill){
        let oy = (res["DATE"]).substring(0,2);
        let y = (oy < 90) ? '20' + oy : '19' + oy;
        let m = (res["DATE"]).substring(2,4);
        let d = (res["DATE"]).substring(4,6);
        var date = new Date();
        date.setFullYear(y);
        date.setDate(d);
        date.setMonth(m-1);
        let index = "document";
        let type = (res["ARTICLETYPE"] === undefined) ? "unlabeled" : res["ARTICLETYPE"];
        let id = res["DOCID"];
        let obj = {
            date : date,
            headline : res["HEADLINE"],
            byline : (res["BYLINE"] === undefined) ? null : res["BYLINE"],
            edition : parseInt(res["EDITION"]),
            page : parseInt(res["PAGE"]),
            articletype : (res["ARTICLETYPE"] === undefined) ? "unlabeled" : res["ARTICLETYPE"],
            graphic : (res["GRAPHIC"] === undefined) ? null : res["GRAPHIC"],
            recordno : res["RECORDNO"],
            text : res["TEXT"]
        };
        fulfill({
            index : index,
            type : type,
            id : id,
            body : obj
        });
    });
};

fs.readdirSync(target).forEach(function(file){
    if(file.indexOf('.sgml') != -1){
        let doc = target+file;
        let data = "<ROOT>\\n"+fs.readFileSync(doc, "utf8")+"\\n</ROOT>";
        parser.parseString(data)
            .then(function(res){
                if(res === null) console.log("null exception");
                else {
                    for(var i = 0; i < res["DOC"].length; i++){
                        indexObj(res["DOC"][i]).then(function(idx){ 
                            conn.create(idx.index, idx.type, idx.id, idx.body)
                                    .then(function(res){
                                        console.log(res);
                                    },function(err){
                                        console.log(err);
                                    });
                        });
                    }
                }
            },function(err){
                console.log(err);
            });
    }
});