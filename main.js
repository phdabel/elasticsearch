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
        let type = 'news';
        let id = res["DOCID"];
        let obj = {
            date : date,
            headline : res["HEADLINE"],
            byline : (res["BYLINE"] === undefined) ? null : res["BYLINE"],
            edition : parseInt(res["EDITION"]),
            page : parseInt(res["PAGE"]),
            articletype : (res["ARTICLETYPE"] === undefined) ? null : res["ARTICLETYPE"],
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

function readFilePromise(doc){
    return new Promise(function(fulfill,reject){
        fs.readFile(doc, "utf8",function(err,data){
            if(err) reject(err);
            else fulfill("<ROOT>\\n"+data+"\\n</ROOT>");
        });
    });
};

function reading(doc){
    readFilePromise(doc)
    .then(function(data){
        parser.parseString(data)
        .then(function(res){
            if(res === null) console.log("null exception");
            else {
                for(var i = 0; i < res["DOC"].length; i++){
                    indexObj(res["DOC"][i]).then(function(idx){ 
                        conn.create(idx.index, idx.type, idx.id, idx.body)
                                .then(function(res){
                                    console.log("\\nok\\n");
                                },function(err){
                                    console.log("err");
                                });
                    });
                }
            }
        });
    });
}

fs.readdir(target, function(err,files){
    if(err) console.log(err);
    else {
        for(var i = 0; i < files.length; i++){
            if(files[i].indexOf('.sgml') !== -1){
                let doc = target + files[i];
                setTimeout(reading, i*1000, doc);
            }
        }
    }
});

