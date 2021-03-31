import { NextApiRequest, NextApiResponse } from 'next'
import { DatabaseAdapter } from '../../../db/DatabaseAdapter'

  
export default (req: NextApiRequest, res: NextApiResponse) => {

    /**
     * Request method must be POST, 
     * without an empty body, with body having url property
     */
    if(req.method !== "POST"  || !req.body  || !req.body.url) {
        res.status(400).end("Bad Request");
        return;
    }

    /**TODO
     * Authentication
     */

    //Get topic from query parameter
    const {topic} = req.query;

    //Get subscription url from POSTed body
    const subscriberURL = req.body.url;

    //Prepare respnse to send back to calling client
    const response = {  
        url: subscriberURL,
        topic: topic
    }

    const db = new DatabaseAdapter();

    // Method to save subscrion record to db
    const saveRecord = () => {
        
        db.save(topic, subscriberURL);      
        
    }

saveRecord();

res.status(200).json(response);

}