var elasticsearch = require('elasticsearch');
var Promise = new require('promise');

module.exports = class ElasticSearchConnection {
    
    constructor(params={debug:true}){
        let log = [];
        if(params.debug){
            log = 'trace';
        }
        this.client = new elasticsearch.Client({
            host: 'localhost:9200',
            log: log
        });
    }
    
    /**
     * 
     * @returns {undefined}
     */
    ping(){
        this.client.ping({
            requestTimeout: 1000
        }, function(err){
            if(err) console.trace('elasticsearch cluster is down!');
            else console.log('cluster running');
        });
    }
    
    /**
     * Adiciona um documento JSON em um índice específico,
     * tornando-o "buscável".
     * Se um documento com o mesmo <em>index</em>, <em>type</em> e <em>id</id>
     * já existe, um erro ocorrerá.
     * 
     * @param string index 
     * <br/>Nome da coleção de documentos
     * @param string type
     * <br/>Partição ou categoria lógica usada para armazenar
     * diferentes tipos de documentos no mesmo index.
     * @param string id
     * <br/> Identificador único do documento
     * @param Object body
     * <br/> Documento no formato objeto JSON
     * @returns {nm$_basemodel.Promise}
     */
    create(index, type, id, body){
        let c = this.client;
        return new Promise(function(fulfill,reject){
            c.create({
                index: index,
                type: type,
                id: id,
                body: body
            },function(err,resp){
                if(err) reject(err);
                else fulfill(resp);
            });
        });
    }
    
    /**
     * Retorna um objeto JSON de um índice, baseado no seu <em>id</em>.
     * 
     * @param string index 
     * <br/>Nome da coleção de documentos
     * @param string type
     * <br/>Partição ou categoria lógica usada para armazenar
     * diferentes tipos de documentos no mesmo index.
     * @param string id
     * <br/> Identificador único do documento
     * @returns {nm$_basemodel.Promise}
     */
    read(index, type, id){
        let c = this.client;
        return new Promise(function(fulfill,reject){
            c.get({
                index: index,
                type: type,
                id: id
            }, function(err, resp){
                if(err) reject(err);
                else fulfill(resp);
            });
        });
    }
    
    /**
     * Altera parte de um documento.
     * O parâmetro obrigatório <em>body</em> pode conter
     * uma de duas coisas:
     * 
     * <ul>
     *  <li>um documento parcial, que pode ser mesclado com o que já existe;</li>
     *  <li>um <em>script</em> que atualizará o conteúdo do documento.</li>
     * </ul>
     * 
     * @param string index 
     * <br/>Nome da coleção de documentos
     * @param string type
     * <br/>Partição ou categoria lógica usada para armazenar
     * diferentes tipos de documentos no mesmo index.
     * @param string id
     * <br/> Identificador único do documento
     * @param Object body
     * <br/> Documento no formato objeto JSON
     * @returns {nm$_basemodel.Promise}
     */
    update(index, type, id, body){
        let c = this.client;
        return new Promise(function(fulfill,reject){
            c.update({
                index: index,
                type: type,
                id: id,
                body: {doc: body}
            }, function(err,resp){
                if(err) reject(err);
                else fulfill(resp);
            });
        });
    }
    
    /**
     * Exclui um objeto JSON de um índice específico baseado
     * no seu <em>id</em>.
     * 
     * @param string index 
     * <br/>Nome da coleção de documentos
     * @param string type
     * <br/>Partição ou categoria lógica usada para armazenar
     * diferentes tipos de documentos no mesmo index.
     * @param string id
     * <br/> Identificador único do documento
     * @returns {nm$_basemodel.Promise}
     */
    delete(index, type, id){
        let c = this.client;
        return new Promise(function(fulfill,reject){
            c.delete({
                index: index,
                type: type,
                id: id
            }, function(err, resp){
                if(err) reject(err);
                else fulfill(resp);
            });
        });
    }
    
};