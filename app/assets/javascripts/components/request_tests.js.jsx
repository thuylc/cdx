var RequestedTestRow = React.createClass({
  getInitialState: function() {
  return {
    statusField: '',
    test: this.props.requested_test
    };
  },
  statusChanged: function(event) {
    var temp_test = this.state.test;
    temp_test.status=event.target.value;
    this.setState({
      test: temp_test
    });
    this.props.onTestChanged(this.state.test);
  },
  commentChanged: function(new_comment) {
    var temp_test = this.state.test;
    temp_test.comment=new_comment;
    this.setState({
      test: temp_test
    });
    this.props.onTestChanged(this.state.test);
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

    created_at = new Date(Date.parse(this.state.test.created_at));
    created_at_date=created_at.toISOString().slice(0, 10);

    var status_array=[];
    for (var index in this.props.status_types) { 
      status_array.push(index);
    }

    var status_data = status_array,
        MakeItem = function(X) {
          return <option key={X} value={X}>{X}</option>;
         };

  return (
    <tr>
      <td>{this.state.test.name}</td>
      <td>{encounter.uuid}</td>
      <td>{encounter.site.name}</td>
      <td>{samples}</td>
      <td>{this.props.requested_by}</td>
      <td>{created_at_date}</td>
      <td>{encounter.testdue_date}</td>
      <td><select key={this.state.test.id} onChange = {
            this.statusChanged
           }
          className="input-x-medium"
          value={this.state.test.status}>
          {status_data.map(MakeItem)}
          </select></td>
      <td><TextInputModal key={this.state.test.id} comment={this.state.test.comment} commentChanged={this.commentChanged} edit={this.props.edit}/></td>
    </tr>);
  }
});

var RequestedTestsList = React.createClass({
  getDefaultProps: function() {
    return {
      title: "Requested Tests",
      titleClassName: ""
    }
  },
  onTestChanged: function(new_test) {
    this.props.onTestChanged(new_test)
  },
  render: function() {
    return (
      <table className="table" cellPadding="0" cellSpacing="0">
        <colgroup>
          <col width="10%" />
          <col width="15%" />
          <col width="10%" />
          <col width="15%" />
          <col width="15%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>
        <thead>
          <tr>
            <th className="tableheader" colSpan="8">
              <span className={this.props.titleClassName}>{this.props.title}</span>
            </th>
          </tr>
          <tr>
            <td>Name</td>
            <td>Order ID</td>
            <td>Site</td>
            <td>Sample ID</td>
            <td>Requested By</td>
            <td>Requested Date</td>
            <td>Due Date</td>
            <td>Status</td>
            <td>Comment</td>
          </tr>
        </thead>
        <tbody>
          {this.props.requested_tests.map(function(requested_test) {
             return <RequestedTestRow key={requested_test.id} requested_test={requested_test} onTestChanged={this.onTestChanged}
              encounter={this.props.encounter} requested_by={this.props.requested_by}  status_types={this.props.status_types} edit={this.props.edit}/>;
          }.bind(this))}
        </tbody>
      </table>
    );
  }
});

var RequestedTestsIndexTable = React.createClass({
  onTestChanged: function(new_test) {
    this.props.onTestChanged(new_test)
   },
  render: function() {
    return <RequestedTestsList requested_tests={this.props.requested_tests} encounter={this.props.encounter} onTestChanged={this.onTestChanged}
              title={this.props.title} requested_by={this.props.requested_by} titleClassName="table-title" status_types={this.props.status_types} edit={this.props.edit} />
  }
});
