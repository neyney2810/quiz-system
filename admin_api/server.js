const express = require('express');
const app = express();

const port = 3001;

//Connect to DB
const mongodb = require('mongodb');
const middleware = require('./middleware');
const QuestionManager = require('./QuestionManager');
const DB_NAME = 'quiz';


(async () => {
    try {
      const client = await mongodb.MongoClient.connect(`mongodb://localhost:27017/${DB_NAME}`)
      db = client.db();
  
      QuestionManager.questions_collection = db.collection('questions');
      
      console.log("Data from database loaded successfully");
    } catch (error) {
      console.log(error.message);
    
    }
})();

app.use(express.json());
app.use(express.urlencoded());
app.use(middleware);

//UC1: get all questions
app.get('/questions', async ( req, res ) => {
    console.log("IM called")
    res.statusCode = 200;

    let questions = await QuestionManager.getAllQuestions();
    res.json(questions);
});

//UC2: create a new question
app.post('/questions', async ( req, res ) => {
    let newQuestionData = QuestionManager.validateQuestionData(req.body);

    if (newQuestionData.error.length > 0) {
        res.statusCode = 403;
        res.json(newQuestionData);
        return;
    }

    res.statusCode = 201;

    let newQuestion = await QuestionManager.createNewQuestion(newQuestionData.question);

    res.json(newQuestion);
});

//UC3: get details of a question
app.get('/questions/:id', async ( req, res ) => {
    let id = req.params.id;

    let question = await QuestionManager.findQuestionWithID(id);

    if (question) {
        res.statusCode = 200;
        res.json(question);
    } else {
        res.sendStatus(404);
    }
});

//UC4: update a question
app.put('/questions/:id', async ( req, res ) => {
    let id = req.params.id;

    let questionData = await QuestionManager.findQuestionWithID(id);
    if (!questionData) res.sendStatus(404);

    let newData = QuestionManager.validateQuestionData(req.body);

    if (newData.error.length > 0) res.sendStatus(400);

    await QuestionManager.updateQuestionData(id, newData.question);

    res.status = 200;
    res.json({ _id : id, ...newData.question });
})

//UC5: delete a question
app.delete('/questions/:id', async ( req, res ) => {
    let id = req.params.id;

    await QuestionManager.deleteQuestionWithID(id);

    res.sendStatus(200);
})

app.listen(port, () => {
    console.log("Server api listen at port " + port)
})