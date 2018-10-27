var elasticsearch = require('elasticsearch');
var Promise = new require('promise');

module.exports = class Model {
    
    constructor(){
        this.client = new elasticsearch.Client({
            host: 'localhost:9200',
            log: 'trace'
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
     * 
     * @param string index
     * @param string type
     * @param string id
     * @param Object body
     * @returns {undefined}
     */
    create(index, type, id, body){
        this.client.create({
            index: index,
            type: type,
            id: id,
            body: body
        });
    }
    
    /**
     * 
     * @param string index
     * @param string type
     * @param string id
     * @returns {undefined}
     */
    read(index, type, id){
        this.client.get({
            index: index,
            type: type,
            id: id
        });
    }
    
    /**
     * 
     * @param string index
     * @param string type
     * @param string id
     * @param Object body
     * @returns {undefined}
     */
    update(index, type, id, body){
        this.client.update({
            index: index,
            type: type,
            id: id,
            body: {doc: body}
        });
    }
    
    /**
     * 
     * @param string index
     * @param string type
     * @param string id
     * @returns {undefined}
     */
    delete(index, type, id){
        this.client.delete({
            index: index,
            type: type,
            id: id
        });
    }
    
};