import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { IDatabase } from '../interfaces/Database';

export class DatabaseAdapter {

    /**
     * I deceided to use a flat file JSON database (lowdb : https://github.com/typicode/lowdb) to make this application easier to 
     * run and to avoid overhead of setting up a database server. This class can be re-written
     * to talk to any conventional database  
     */

    private db;

    constructor() {
        const adapter = new FileSync<IDatabase>('db/db.json');
        this.db = lowdb(adapter);
    
        //Prepare db initial data and write it to db to ensure db works
        this.db.defaults({subscriptions: {
            topic: "testTopic", subscribers: ["http://hello.world"]
        }}).write();
    }

    getTopic(topic){
        return this.db.get('subscriptions').find({ topic: topic }).value();
    }

    save(topic, subscriberURL) {
        let subscribedTopic = this.getTopic(topic);
         
        if(subscribedTopic === undefined) {
           this.insertDB(topic,subscriberURL);

        } else {
            this.updateDB(topic,subscriberURL,subscribedTopic);
        } 
    }

    insertDB(topic, subscriberURL) {
        this.db.set('subscriptions.' + topic, { topic: topic, subscribers: [subscriberURL]}).write();
    }

    updateDB(topic, subscriberURL, subscribedTopic) {
        subscribedTopic.subscribers.push(subscriberURL);

         /**
          * Make topic subscribers unique to avoid 
          * sending to one server multiple times
          */
         let uniqueSubscribers = subscribedTopic.subscribers.filter((item, index) => subscribedTopic.subscribers.indexOf(item) === index);
    
        this.db.set('subscriptions.' + topic, { topic: topic, subscribers: uniqueSubscribers}).write();
    }

}