var RequestedTestRow = React.createClass({
  render: function() {
	  var encounter = this.props.encounter;
    var test = this.props.requested_test;


    return (
    <tr>
      <td>{test.name}</td>
      <td>Results...</td>
<td>sample...</td>
<td>type...</td>
      <td>{test.status}</td>
      <td>error_code...</td>
      <td>start...</td>
      <td>end...</td>
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

  render: function() {
 
    return (
      <table className="table" cellPadding="0" cellSpacing="0">
        <colgroup>
          <col width="10%" />
          <col width="15%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="15%" />
          <col width="15%" />
        </colgroup>
        <thead>
          <tr>
            <th className="tableheader" colSpan="8">
              <span className={this.props.titleClassName}>{this.props.title}</span>
            </th>
          </tr>
          <tr>
            <td>Name</td>
            <td>Results</td>
            <td>Sample</td>
            <td>Type</td>
            <td>Status</td>
            <td>Error Code</td>
            <td>Start</td>
            <td>End</td>
          </tr>
        </thead>
        <tbody>
          {this.props.requested_tests.map(function(requested_test) {
             return <RequestedTestRow requested_test={requested_test}
              encounter={this.props.encounter} />;
          }.bind(this))}
        </tbody>
      </table>
    );
  }
});

var RequestedTestsIndexTable = React.createClass({
  render: function() {
    return <RequestedTestsList requested_tests={this.props.requested_tests} encounter={this.props.encounter}
              title={this.props.title} titleClassName="table-title" />
  }
});
