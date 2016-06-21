var PatientComments = React.createClass({
  getInitialState: function() {
    return {
      patientComments: [],
      queryOrder: true
    };
  },

  getComments: function(field, e) {
    if (e) { e.preventDefault(); }
    this.serverRequest = $.get(this.props.commentsUrl + this.getParams(field), function (results) {
      this.setState({
        patientComments: results
      });
    }.bind(this));
  },

  getParams: function(field) {
    var orderField = field === 1 ? 'date' : 'name';
    this.state.queryOrder = !this.state.queryOrder;
    return '&field='+ orderField + '&order=' + this.state.queryOrder;
  },

  componentDidMount: function() {
    this.getComments(1);
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render: function(){
    var rows = [];
    this.state.patientComments.forEach(
      function(comment) {
        rows.push(<PatientComment comment={comment} key={comment.id} />);
      }
    );

    return (
      <div className="row">
        <table className="patient-history">
          <thead>
            <tr>
              <th><a href="#" onClick={this.getComments.bind(null, 1)}>Date</a></th>
              <th><a href="#" onClick={this.getComments.bind(null, 2)}>Commenter</a></th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
});
