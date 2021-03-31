import { NextApiRequest, NextApiResponse } from 'next'
import { DatabaseAdapter } from '../../../db/DatabaseAdapter';

export default (req: NextApiRequest, res: NextApiResponse) => {

    /**
     * Request method must be POST, must not be empty
     * and must be a javascript object and must not be null
     */
    if(req.method !== "POST"  || !req.body || typeof req.body !== 'object' || req.body === null) {
        res.status(400).end("Bad Request");
        return;
    }

    /**TODO
     * Authentication
     */

    const db = new DatabaseAdapter();

    //Get topic from query parameter
    const {topic} = req.query;

    // Get all subscribers to this topic
    let topicSubscriptions = db.getTopic(topic);

    /**
     * Check if  topicSubscriptions isNull or undefined
     * Return 'No subscribers found message' 
     * and set response code to 200
     */
    if((topicSubscriptions === null || topicSubscriptions === undefined) || (Object.keys(topicSubscriptions).length === 0 && topicSubscriptions.constructor === Object)) {
        res.status(200).end("No subscribers found");
        return;
    }


    /** TODOs
     * The purpose of this is to report back to the calling client the 
     * summary report of activities of what went down during the entire
     * operation. urls will be pushed into failledURLs and successURLs
     */
    let pubsStatus = {
        failledURLs:[],
        successURLs:[],
        totalSubcribers: topicSubscriptions.subscribers.length
    };

    //Message to broadcast to suscribers
    const message = { 
        topic: topic, 
        data: JSON.stringify(req.body) // whatever data was sent in the publish body
        }

    //Form a valid fetch() request options
    const request = { 
        options: {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(message)
        }
    }
    

    /**
     * Promise.all provides a mechanism to run all request concurrently in
     * an asynchronous manner without one http request waiting for the other to finish.
     * According to V8 unit tests, Promise.all can handle 2²¹ or 2,097,151 concurrent promises
     * (https://github.com/v8/v8/blob/4b9b23521e6fd42373ebbcb20ebe03bf445494f9/test/mjsunit/es6/promise-all-overflow-1.js#L9-L12) 
     * 
     */
    Promise.all(topicSubscriptions.subscribers.map(url => 

        /**
         * fecth() API is only natively supported in browsers, 
         * but interestingly, Next.js provides a polyfill support for fetch()!
         */
        fetch(url, request.options)

    ))

    .then(result => {
        
        console.log("RESOLVED");
        //Return success and set response code to 200
        res.status(200).end("All broadcast successful");
    })

    .catch(err => {
        /**
         * Would need to implement a mechanism to handle
         * the removal of any failed url from topicSubscriptions.subcribers array
         * then try again because Promise.all fails completely if any of the url is
         * not accessible. However using Promise.allSettled would be a perfect solution
         * to this problem but does not currently work in Typescript Version 3.9.7 which is 
         * what my development environment is running
         */
        console.warn("ERROR", err.message);
        // Return any inaccessible url and set response code to 422(Unprocessable Entity) 
        res.status(422).end(err.message);
    })

    .finally(()=> {
        res.end("EOF!");
    })
    

}