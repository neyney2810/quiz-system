class Result extends React.Component {

    render() {
        return (
            <div class="row">
                <div class="col-sm-8 col-sm-offset-2">
                    <div id="result-of-question" class="pulse animated" style="display: none;">
                        <span id="totalCorrect" class="pull-right"></span>
                        <table class="table table-hover table-responsive" >
                            <thead>
                                <tr>
                                    <th>Question No.</th>
                                    <th>Our answer</th>
                                    <th>Your answer</th>
                                    <th>Result</th>
                                </tr>
                            </thead>
                            <tbody id="quizResult"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}