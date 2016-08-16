var PatientComments = React.createClass({
  getInitialState: function() {
    return {
      patientComments: [],
      queryOrder: true,
      loadingMessasge: I18n.t("components.patients.show.history.msg_loading_comment"),
      orderedColumns: {},
      availableColumns: [
        { title: I18n.t("components.patients.show.history.col_comment_date"),        fieldName: 'date' },
        { title: I18n.t("components.patients.show.history.col_commenter"),   fieldName: 'commenter' },
        { title: I18n.t("components.patients.show.history.col_comment_des"), fieldName: 'description' }
      ]
    };
  },

  getData: function(field, e) {
    if (e) { e.preventDefault(); }
    this.serverRequest = $.get(this.props.commentsUrl + this.getParams(field), function (results) {
      if (results.length > 0) {
        this.setState({ patientComments: results });
        this.updateOrderIcon(field);
        $("table").resizableColumns({store: window.store});
      } else {
        this.setState({ loadingMessage: I18n.t("components.patients.show.history.msg_no_comment") });
      };
    }.bind(this));
  },

  getParams: function(field) {
    this.state.queryOrder = !this.state.queryOrder;
    return '&field='+ field + '&order=' + this.state.queryOrder;
  },

  updateOrderIcon: function(orderedField) {
    var that                       = this;
    var updatedState               = {};
    var iconValue                  = (this.state.queryOrder == true) ? '&#x25BC;' : '&#x25B2;';
    this.state.availableColumns.forEach(
      function(column) {
        updatedState[column.fieldName] = ''
      }
    );
    updatedState[orderedField] = iconValue;
    this.setState({ orderedColumns: updatedState });
  },

  componentDidMount: function() {
    this.getData('date');
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render: function(){
    var rows       = [];
    var rowHeaders = [];
    var that       = this;

    this.state.patientComments.forEach(
      function(comment) {
        rows.push(<PatientComment comment={comment} key={comment.id} />);
      }
    );

    this.state.availableColumns.forEach(
      function(availableColumn) {
        rowHeaders.push(<OrderedColumnHeader key={availableColumn.fieldName} title={availableColumn.title} fieldName={availableColumn.fieldName} orderEvent={that.getData} orderIcon={that.state.orderedColumns[availableColumn.fieldName]} />);
      }
    );

    return (
      <div className="row">
        {
          this.state.patientComments.length < 1 ? <LoadingResults loadingMessage={this.state.loadingMessage} /> :
          <table className="table patient-history" data-resizable-columns-id="patient-comments-table">
            <thead>
              <tr>
                {rowHeaders}
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
        }
      </div>
    );
  }
});
