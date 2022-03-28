import './App.css';
import './component/QuestionCSS.css';
import Question from './component/Question.js'
import Header from './component/Header.js'
import React, { useState } from 'react';

function App( {data} ) {

  const [currentIndex, changeQuestion] = useState(-1);
  const [attempt] = useState(data);
  const [userAnswer, changeUserAnswer] = useState({});

  const increaseQuestion = () => {
    changeQuestion(currentIndex+1);
  };

  const decreaseQuestion = () => {
    changeQuestion(currentIndex-1);
  }

  const addUserAnswer = (question_id, answer_index) => {
    let answers = userAnswer;
    answers[question_id] = answer_index;
    changeUserAnswer(answers);
    setTimeout(increaseQuestion, 1000);
  }

  return (
    <div className="App">
      {(currentIndex < 0) ? <Header start={increaseQuestion} /> : 
        <Question index={currentIndex} 
                  attempt={attempt} 
                  userAnswer={userAnswer} 
                  addUserAnswer={addUserAnswer} 
                  changeQuestion={increaseQuestion}
                  decreaseQuestion={decreaseQuestion} />
      }
    </div>
  );
}

export default App;
