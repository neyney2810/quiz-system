var ObjectId = require('mongodb').ObjectId;

var QuestionManager = {
    questions_collection : null,

    getAllQuestions : async function () {
        let questions = await this.questions_collection.find().toArray();
        return questions;
    },

    validateQuestionData : function (questionData) {
        console.log(questionData);
        let params = { error : [], question : questionData };
        //text
        if (typeof questionData.text != "string") {
            params.error.push('Question muss be a string');
        }
        //answers
        if (questionData.answers == undefined) {
            params.error.push('No answers data');
        }
        if (questionData.answers != undefined && questionData.answers.length == undefined) {
            params.error.push("Answers muss be given");
        }
        //correctAnswer
        if (questionData.correctAnswer == undefined) {
            params.error.push("Correct answer muss be given");
        }

        if (questionData.answers.length != undefined && questionData.answers.length < questionData.correctAnswer) {
            params.error.push("Correct Answer can not be found")
        }

        return params;
    },

    createNewQuestion : async function (questionData) {
        let result = await this.questions_collection.insertOne(questionData);
        return {
            _id : result.insertedId,
            ...questionData
        };
    },

    findQuestionWithID : async function (id) {
        let question = await this.questions_collection.findOne( { _id : ObjectId(id) } );
        return question;
    },

    updateQuestionData : async function (id, questionData) {
        let updated = await this.questions_collection.updateOne({ _id: ObjectId(id) }, { $set : questionData});
        return updated.acknowledged;
    },

    deleteQuestionWithID : async function (id) {
        let deleted = await this.questions_collection.deleteOne( { _id : ObjectId(id) } );
        console.log(deleted);
        return deleted;
    }

}

module.exports = QuestionManager;