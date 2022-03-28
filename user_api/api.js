import express, { json, urlencoded } from 'express';

const app = express();
const port = 8080;

import { MongoClient, ObjectId } from 'mongodb';
import Attempt from './module/Attempt.js';
import middleware from './module/middleware.js';


const DB_NAME = 'quiz';
let db = null;
let questions_collection = null;
let attempt_collection = null;

(async () => {
  try {
    const client = await MongoClient.connect(`mongodb://localhost:27017/${DB_NAME}`)
    db = client.db();

    questions_collection = db.collection('questions');
    attempt_collection = db.collection('attempts');
    
    console.log("Data from database loaded successfully");
  } catch (error) {
    console.log(error.message);
  
  }
})();


app.use(json());
app.use(urlencoded());
app.use(middleware);

app.get('/', (req, res) => {

  res.send('Start Up Successfully!');
})

app.post('/attempts', async (req, res) => {

  res.status = 201;

  const data_of_questions = await questions_collection.aggregate([{ $sample: { size: 10 } }]).toArray();

  let attempt = new Attempt( { questions : data_of_questions } );

  await attempt_collection.insertOne(attempt);

  res.json(attempt.getAttemptData());
});

//POST: /attempts/:id/submit
app.post('/attempts/:id/submit', async (req, res) => {
  res.status = 200;

  let attemptID = req.params.id;

  let attemptData = await attempt_collection.findOne( { _id : ObjectId(attemptID) } );
  
  let attempt = new Attempt(attemptData);
  attempt.userAnswer = req.body;
  
  let isComputed = attempt.computeScore();

  if (isComputed.error) {

    res.json(isComputed);
  } else {
    //Save User answer for later process
    await attempt_collection.updateOne( { _id : new ObjectId(attemptID) }, { $set : attempt} );
  
    res.json(attempt.getAttemptData());
  }

})

app.listen(port, () => {

    console.log(`Quiz API listening at http://localhost:${port}`);
});

