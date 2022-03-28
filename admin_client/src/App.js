import React from 'react';
import Swal from 'sweetalert2';

class App extends React.Component {
  constructor (props) {
    super(props);


    this.state = {
      questions : [],
      selectedQuestionIndex : 0,
      activeTemplate : "index", //index, add or edit

      isEditing : false,

      currentShowQuestion : []
    }

    this.form = React.createRef()

    this.handleChangeTemplate = this.handleChangeTemplate.bind(this);
    this.openEditTemplate = this.openEditTemplate.bind(this);
    this.handleDeleteQuestion = this.handleDeleteQuestion.bind(this);
    this.handleUpdateQuestion = this.handleUpdateQuestion.bind(this);
  }

  componentDidMount() {
    fetch('http://127.0.0.1:3001/questions', { method : 'GET' })
      . then( (response) => response.json() )
      . then( questions => {

        this.setState( { questions : questions, currentShowQuestion : questions } )
      })
      . catch((error) => console.log(error))
  }

  setEditing () {
    this.setState( { isEditing : true } )
  }

  submitForm () {
    this.form.current.submitForm()
  }

  handleChangeTemplate ( event, templateName ) {
    event.preventDefault();
    if (this.state.activeTemplate !== "index" && this.state.isEditing === true) {
      Swal.fire( {
        title: 'Save question',
        text: "You are editing a question",
        icon: 'warning',
        showDenyButton : true,
        denyButtonText: "Don't save",
        showCancelButton : true,
        cancelButtonText : "cancel",
        confirmButtonColor: '#3085d6',
        confirmButtonText: "Save"
      } )
        .then (result => {
          if (result.isConfirmed) {
            this.submitForm();
          }
          this.setState( { activeTemplate : templateName } )
        })
    } else {
      this.setState( { activeTemplate : templateName } )
    }

  }

  openEditTemplate ( event, questionIndex ) {
    event.preventDefault();
    this.setState( { selectedQuestionIndex : questionIndex, activeTemplate : "edit" } );
  }

  handleDeleteQuestion ( event, index ) { 
    event.preventDefault();

    Swal.fire( {
      title: 'Delete this question?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    } )
      .then ( result => {
        if ( result.isConfirmed ) {
          
          let questions = this.state.questions;
    
          let id = questions[index]._id;
    
          fetch('http://127.0.0.1:3001/questions/' + id, { method : 'DELETE' })
            .then ( (response) => {
              if (response.status === 200) {
                questions.splice(index, 1);
                this.setState({questions : questions})
                Swal.fire({
                  icon: 'success',
                  title: 'Question deleted',
                  showConfirmButton: true,
                  timer: 1500
                })
              }
            } )
            .catch ( (error) => console.log(error) )
        }
    })



  }

  handleUpdateQuestion ( index, newQuestion ) {
    if ( index === -1 ) {

      let questions = this.state.questions;

      fetch('http://127.0.0.1:3001/questions', { 
        method : "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuestion)
       })
        .then ( (response) => response.json() )
        .then ( (question) => {
          questions.push(question);
          this.setState({questions : questions, isEditing : false})
        } )
        .catch((error) => console.log(error))


    } else {
      //update question UC4
      let questions = this.state.questions;

      let id = questions[index]._id;

      fetch('http://127.0.0.1:3001/questions/' + id, { 
        method : "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuestion)
       })
        .then ( (response) => response.json() )
        .then ( (question) => {
          questions[index] = question;
          this.setState({questions : questions, isEditing : false})
        } )
        .catch( (error) => console.log(error) )

    }
  }

  handleSearch (event) {
    event.preventDefault();
    let value = event.currentTarget.value.trim();
    let keywords = value.split(' ');

    let questions = this.state.questions;

    if (keywords.length > 0) {

      questions = questions.filter(question => {
        for (const keyword of keywords) {
          if (question.text.toLowerCase().indexOf(keyword.trim().toLowerCase()) > -1) return true;
        }
        return false;
      })
    }

    this.setState({ currentShowQuestion : questions })
  }


  render () {
    return (
      <React.Fragment>
      <aside>
        <h3>WPR</h3>

        <header>
            <h2>HTML Quiz</h2>
        </header>
        
        <ul>
            <li><a href="index.html" 
                   onClick={(event) => this.handleChangeTemplate(event, "index")} 
                   className={(this.state.activeTemplate === "index") ? "active" : ""}><i className="far fa-question-circle"></i> All questions</a>
            </li>
            <li><a href="index.html"
                  onClick = {event => this.handleChangeTemplate(event, "add")}
                  className={(this.state.activeTemplate === "add") ? "active" : ""}><i className="far fa-plus"></i> New question</a></li>
        </ul>
      </aside>

      <main>
          {(this.state.activeTemplate === "index") ? (<Index changeTemplate = {this.handleChangeTemplate} 
                                                             questions = {this.state.currentShowQuestion} 
                                                             openEditTemplate = {this.openEditTemplate}
                                                             handleDeleteQuestion = {this.handleDeleteQuestion}
                                                             handleSearch = {this.handleSearch.bind(this)}
                                                             />) : 
              ( (this.state.activeTemplate === "add") ? (<NewQuestion handleUpdateQuestion={this.handleUpdateQuestion}
                                                                      ref = {this.form}
                                                                      setEditing = {this.setEditing.bind(this)} />) :
                  <AvailableQuestion question = {this.state.questions[this.state.selectedQuestionIndex]}
                        ref = {this.form}
                        index = {this.state.selectedQuestionIndex}
                        handleUpdateQuestion = {this.handleUpdateQuestion}
                        setEditing = {this.setEditing.bind(this)}/> 
          )}
      </main>
      
    </React.Fragment>

    )
  }
}

class Index extends React.Component{
  //changeTemplate
  //questions
  //openEditTemplate
  constructor (props) {
    super(props);

    this.state = {
      questions : this.props.questions
    }

  }

  render () {
    return (
      <div className="container">
        <h1>All questions</h1>

        <div id="search">
            <input type="text" placeholder="Search..." onKeyUp = {this.props.handleSearch} />
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Question</th>
              <th>Answer</th>
              <th width="210">Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.questions.map((question, index) => {
                return (
                  <tr key = {question._id}>
                    <td>{index + 1}</td>
                    <td>{question.text}</td>
                    <td>{question.answers[question.correctAnswer]}</td>
                    <td>
                        <a href="index.html"
                          className="btn btn-blue"
                          onClick={(event) => {this.props.openEditTemplate(event, index)}}><i className="far fa-edit"></i> Edit</a>
                        <a href="index.html"
                           className="btn btn-orange"
                           onClick={(event) => this.props.handleDeleteQuestion(event, index)}><i className="far fa-trash-alt"></i> Delete</a>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
      )
  }
}

class Question extends React.Component {
  //props: question, index
  //Change: add or change question data

  constructor (props) {
    super(props);

    let defaultQuestion = {
      text : "Please enter a question",
      answers : [
        "Answer 1",
        "Answer 2"
      ],
      correctAnswer : 0
    }

    this.state = {
      question : (this.props.question) ? this.props.question : defaultQuestion,
      index : (this.props.index > -1) ? this.props.index : -1,
    }

    this.form = React.createRef();

    this.submitForm = this.submitForm.bind(this);
    this.handleRemoveAnswer = this.handleRemoveAnswer.bind(this);
    this.handleAddNewAnswer = this.handleAddNewAnswer.bind(this);

  }

  submitForm (event) {
    if (event) { event.preventDefault(); }
    let form = this.form.current;
    
    let text = form['text'].value;

    let answers = [];
    let answerForm = form['answers'];
    for (let i = 0; i < answerForm.length; i++) {
      answers.push(answerForm[i].value)
    }

    let correctAnswer = 0;
    let correctAnswerForm = form['correctAnswer'];
    for (let i = 0; i < correctAnswerForm.length; i++) {
      if (correctAnswerForm[i].checked) {
        correctAnswer = i;
      }      
    }

    let newData = { text, answers, correctAnswer }
    this.setState(newData);
    this.props.handleUpdateQuestion(this.state.index, newData)
  }

  handleAddNewAnswer (event) {
    event.preventDefault();
    let question = this.state.question;
    question.answers.push("Answer " + (question.answers.length + 1));
    this.setState({question : question});
  }

  handleRemoveAnswer (event, answerIndex) {
    event.preventDefault();
    let question = this.state.question;
    question.answers.splice(answerIndex, 1);
    this.setState({question : question});
  }

  render () {
    let question = this.state.question;
    const correctAnswer = question.correctAnswer;
    return (
      <div className="container">
          <h1>{(this.props.index > -1)?"Edit question":"New question"}</h1>
          <form id="frm-create" ref={this.form} onChange={this.props.setEditing}>
              <div className="form-group">
                  <label htmlFor="text">Text</label>
                  <input type="text" name="text" defaultValue={question.text}/>
              </div>
              
              <div className="form-group" >
                  <label>Answers: </label>
                  {question.answers.map((answer, index) => {
                    return (
                      <div className="answer" key={answer}>
                        <input type="text" name="answers" defaultValue={answer} />
                        <div>
                            <input name="correctAnswer" type="radio" value={index} id={index} defaultChecked={(index === correctAnswer) ? true : false} /> <label htmlFor="answer0">correct</label>
                        </div>
                        <button type="button" className="btn btn-orange" onClick={(event) => this.handleRemoveAnswer(event, index)}><i className="fas fa-times"></i> Remove</button>
                      </div>
                    )
                  })}
  
                  <div className="text-right">
                      <button type="button" className="btn btn-blue" onClick={this.handleAddNewAnswer}><i className="fas fa-plus"></i> Add</button>
                  </div>
              </div>
  
              <div className="actions">
                  <button className="btn btn-blue btn-large" onClick={this.submitForm} ><i className="fas fa-save"></i> Save</button>
              </div>
          </form>
      </div>
    )
  }
}

class NewQuestion extends Question {}

class AvailableQuestion extends Question {}


export default App;
