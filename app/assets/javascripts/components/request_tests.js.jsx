var RequestedTestRow = React.createClass({
  getInitialState: function() {
    return {
      statusField:    '',
      test:           this.props.requestedTest,
      showWarning:    false,
      testResultUrl:  "#",
      testResultText: ""
    };
  },

  componentDidMount: function() {
    if ( (this.props.edit == true) && (this.isAssociated() == false) &&
      ((this.state.test.status == 'pending') || (this.state.test.status == 'inprogress')) ) {
      this.setState({ testResultUrl: this.determineTestResultUrl(this.state.test.id, this.state.test.name, this.props.edit) });
      this.setState({ testResultText: I18n.t("components.request_tests.add_result") });
      this.setState({ showWarning: this.props.showDstWarning && this.state.test.name == 'dst' })
    }
    else if ( this.isAssociated() == true) {
      this.setState({ testResultUrl:  this.determineTestResultUrl(this.state.test.id, this.state.test.name, this.props.edit) });
      this.setState({ testResultText: I18n.t("components.request_tests.view_result") });
    }
  },

  statusChanged: function(event) {
    var tempTest    = this.state.test;
    tempTest.status = event.target.value;
    this.setState({ test: tempTest });
    this.props.onTestChanged(this.state.test);
    if (tempTest.status == 'rejected') {
      this.refs.inviteModal.openInviteModal();
    }
  },

  commentChanged: function(newComment) {
    var tempTest     = this.state.test;
    tempTest.comment = newComment;
    this.setState({ test: tempTest });
    this.props.onTestChanged(this.state.test);
  },

  determineTestResultUrl(id, name, edit) {
    var urlPath;
    var newOrEditPath;
    var testOrderPageMode;

    if (edit == true) {
      testOrderPageMode = 'edit';
    } else {
      testOrderPageMode = 'cancel';
    }

    if (this.isAssociated() == true) {
      newOrEditPath = '?test_order_page_mode='+testOrderPageMode;
    } else {
      newOrEditPath = '/new?test_order_page_mode='+testOrderPageMode;
    }

    if (name.indexOf('drugsusceptibility') !== -1) {
      if (name.indexOf('liquid') !== -1) {
        newOrEditPath += '&media=liquid';
      };
      if (name.indexOf('solid') !== -1) {
        newOrEditPath += '&media=solid';
      };
      name = 'dst';
    }
    switch(name) {
      case 'xpertmtb':
        urlPath = "/requested_tests/"+id+"/xpert_result"+newOrEditPath;
        break;
      case 'microscopy':
        urlPath = "/requested_tests/"+id+"/microscopy_result"+newOrEditPath;
        break;
      case 'dst':
        urlPath = "/requested_tests/"+id+"/dst_lpa_result"+newOrEditPath;
        break;
      case 'culture':
        urlPath = "/requested_tests/"+id+"/culture_result"+newOrEditPath;
        break;
      default:
        urlPath = "/requested_tests/"+id+"/undefined_result";
    }
    return urlPath;
  },

  isAssociated: function() {
    var that = this;

    return this.props.associatedTestsToResults.filter(
      function (el) { return el.requested_test_id == that.state.test.id; }
    ).length != 0
  },

  render: function() {
    var encounter = this.props.encounter;

    samples ="";
    for (var i = 0, len = encounter.samples.length;i < len; i++) {
      if (i > 0) {
        samples +=",";
      }
      samples += encounter.samples[i].entity_ids[0]
    }

    var statusArray=[];
    var current_test_id = this.props.requestedTest.id;
    for (var index in this.props.statusTypes) {
      var match_test = this.props.associatedTestsToResults.filter(function (test) {return test.requested_test_id === current_test_id;});
      if ( (match_test.length == 0) && (index == 'completed') ) {
      } else {
        statusArray.push(index);
      }
    }

    var statusData = statusArray, MakeItem = function(X) {
      return <option key={X} value={X}>{X}</option>;
    };

    return (
      <tr>
        <td>{this.state.test.name}</td>
        <td>{samples}</td>
        <td>{this.props.requestedBy}</td>
        <td>{new Date(Date.parse(this.state.test.created_at)).toISOString().slice(0, 10)}</td>
        <td>{encounter.site.name}</td>
        <td>{encounter.testdue_date}</td>
        <td>
          <select key={this.state.test.id} onChange = {
              this.statusChanged
            }
            className="input-x-medium"
            defaultValue={this.state.test.status}
            disabled = {
              !this.props.edit
             }>
            { statusData.map(MakeItem) }
          </select>
        </td>
        <td>
          <TextInputModal key={this.state.test.id} comment={this.state.test.comment} commentChanged={this.commentChanged} edit={this.props.edit} ref='inviteModal' />
        </td>
        <td>
          <TestResultButton testResultUrl={this.state.testResultUrl} testResultText={this.state.testResultText} showWarning={this.state.showWarning} />
        </td>
      </tr>
    );
  }
});

var RequestedTestsList = React.createClass({
  getDefaultProps: function() {
    return {
      title: "Requested Tests",
      titleClassName: ""
    }
  },

  onTestChanged: function(newTest) {
    this.props.onTestChanged(newTest)
  },

  render: function() {
    return (
      <table className="table" id="test-table" cellPadding="0" cellSpacing="0">
        <thead>
          <tr>
            <th className="tableheader" colSpan="9">
              <span className={this.props.titleClassName}>{this.props.title}</span>
            </th>
          </tr>
          <tr>
            <td>{I18n.t("components.request_tests.type_col")}</td>
            <td>{I18n.t("components.request_tests.sample_id_col")}</td>
            <td>{I18n.t("components.request_tests.order_by_user_col")}</td>
            <td>{I18n.t("components.request_tests.requested_date")}</td>
            <td>{I18n.t("components.request_tests.request_by_col")}</td>
            <td>{I18n.t("components.request_tests.due_date_col")}</td>
            <td>{I18n.t("components.request_tests.status_col")}</td>
            <td>{I18n.t("components.request_tests.comment_col")}</td>
            <td>{I18n.t("components.request_tests.result_col")}</td>
          </tr>
        </thead>
        <tbody>
          {this.props.requestedTests.map(function(requestedTest) {
             return <RequestedTestRow key={requestedTest.id} requestedTest={requestedTest} onTestChanged={this.onTestChanged}
              encounter={this.props.encounter} requestedBy={this.props.requestedBy}  statusTypes={this.props.statusTypes}
              edit={this.props.edit} associatedTestsToResults={this.props.associatedTestsToResults} showDstWarning={this.props.showDstWarning} />;
          }.bind(this))}
        </tbody>
      </table>
    );
  }
});

var RequestedTestsIndexTable = React.createClass({
  onTestChanged: function(newTest) {
    this.props.onTestChanged(newTest)
   },

  render: function() {
    return <RequestedTestsList requestedTests={this.props.requestedTests} encounter={this.props.encounter} onTestChanged={this.onTestChanged}
              title={this.props.title} requestedBy={this.props.requestedBy} titleClassName="table-title" statusTypes={this.props.statusTypes}
              edit={this.props.edit} associatedTestsToResults={this.props.associatedTestsToResults} showDstWarning={this.props.showDstWarning} />
  }
});

var TestResultButton = React.createClass({
  getInitialState: function() {
    return {
      displayConfirm:    false
    };
  },

  clickHandler: function(e) {
    e.preventDefault();
    this.setState({ displayConfirm: true });
  },

  cancelClickHandler: function() {
    this.setState({ displayConfirm: false });
  },

  render: function() {
    if (this.state.displayConfirm == true) {
      return (
        <ConfirmationModalEncounter message={I18n.t("components.request_tests.confirm_msg")} title= {I18n.t("components.request_tests.confirm_title")} cancel_target={this.cancelClickHandler} hideOuterEvent={this.cancelClickHandler} target={this.cancelClickHandler} deletion={false} hideCancel={true} confirmMessage= {I18n.t("components.request_tests.close_btn")} />
      );
    }

    if (this.props.showWarning) {
      return (
        <a className="btn-add-link btn-primary" onClick={this.clickHandler}>{I18n.t("components.request_tests.add_result_btn")}</a>
      )
    } else {
      return(
        <a className="btn-add-link btn-primary" href={this.props.testResultUrl}>{this.props.testResultText}</a>
      )
    }
  }
});
