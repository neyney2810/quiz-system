import Swal from 'sweetalert2';

const Question = ( { index, attempt, userAnswer, addUserAnswer, changeQuestion, decreaseQuestion } ) => {

    let id = (index < attempt.questions.length) ? index : attempt.questions.length-1;

    let question = attempt.questions[id];

    const submit = () => {
        const user_api_link = 'http://127.0.0.1:8080';

        const sentData = { 
            method : "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(userAnswer)
        }

        fetch(user_api_link + `/attempts/${attempt._id}/submit`, sentData)
        . then( (response) => response.json() )
        . then( result => {
            if (!result.error) {
                const text = "Your score: " + result.score + '\n' + result.scoreText;
                Swal.fire( {
                    title: 'Submit successfully',
                    text: text,
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: "OK"
                  } )
            } else {
                Swal.fire( {
                    title: "Error",
                    text: "You've already submit this attempt",
                    icon: 'error',
                    confirmButtonText: "OK"
                  } )
                  .then((result) => {
                      if (result.isConfirmed) {
                        window.location.reload()
                      }
                  });
            }

        })
        . catch((error) => console.log(error))
    }

    return (
        <div className="container">

            <div className="row"><br/><br/>
                <div className="col-sm-8 col-sm-offset-2">
                    <div className="loader">
                        <div className="col-xs-3 col-xs-offset-5">
                            <div id="loadbar" style={{display:"none"}}>
                                <img src="https://8finatics.s3.amazonaws.com/static/reload_emi.gif" alt="Loading" className="center-block loanParamsLoader"/>
                            </div>
                        </div>

                        <div id="quiz">
                            <div className="question">
                                <h3><span className="label label-warning" id="qid">{id+1}</span>
                                <span id="question"> {question.text}</span>
                                </h3>
                            </div>
                            <ul>
                                {
                                    question.answers.map( (answer, answerindex) => {
                                        return (
                                            <li key={answer} >
                                                <input type="radio" id={answerindex+"-option"} defaultChecked={answerindex===userAnswer[question._id]} name="selector" value={answerindex} onClick={() => addUserAnswer(question._id, answerindex)}/>
                                                <label htmlFor={answerindex+"-option"} className="element-animation">{answer}</label>
                                                <div className="check"></div>
                                            </li>
                                        )
                                    })
                                }

                                <li>
                                    {(index > 0) ? <button onClick={decreaseQuestion}>Prev</button> : ""}
                                    {(index < attempt.questions.length - 1) ? <button onClick={changeQuestion}>Next</button> : <button onClick={submit}>Submit</button>  }
                                    <button onClick={submit}>Submit</button>
                                </li>

                            </ul>
                        </div>
                    </div>
                    
                </div>
            </div>


        </div>
    )
}


export default Question;