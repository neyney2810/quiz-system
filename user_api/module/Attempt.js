import { ObjectId } from 'mongodb';

class Attempt {

    constructor (attemptdata) {
        this._id = attemptdata._id || undefined;
        this.startedAt = attemptdata.startedAt || new Date();
        this.questions = attemptdata.questions || [];
        this.isCompleted = attemptdata.isCompleted || false;
        this.userAnswer = attemptdata.userAnswer || {};
        this.score = attemptdata.score || 0;
        this.scoreText = attemptdata.scoreText || "";
    }

    getAttemptData () {
        if (this.isCompleted === false) {
            let data = this.questions.map(question => {
                return {
                    _id : question._id,
                    text : question.text,
                    answers : question.answers
                }
            });
            return {
                _id : (this._id) ? (this._id) : "",
                questions : data,
                completed : this.isCompleted,
                score : 0,
                startedAt : this.startedAt
            }
        } else {
            return {
                _id : (this._id) ? (this._id) : "",
                questions : this.questions,
                completed : this.isCompleted,
                userAnswer : this.userAnswer,
                score : this.score,
                scoreText : this.scoreText,
                startedAt : this.startedAt
            };
        }
    }


    computeScore () {
        if (!this.isCompleted) {
            this.score = this.questions.reduce((totalScore, question, currentIndex, questions) => {
                let _id = question._id.toHexString();
                var total = totalScore + ((question.correctAnswer === this.userAnswer[_id]) ? 1 : 0);
                return total;
            }, 0);
            this.isCompleted = true;
            if (this.score < 5) {
                this.scoreText = "Practice more to improve it :D";
            } else if (this.score < 7) {
                this.scoreText = "Good, keep up";
            } else if (this.score < 9) {
                this.scoreText = "Well done!";
            } else {
                this.scoreText = "Perfecto!";
            }
            return { result : "success" }
        } else return { error : "Completed attempt can't be scored again!" }

    }
}


export default Attempt;
