var RequestedTestRow = React.createClass({
  render: function() {
    var encounter = this.props.encounter;
    var test = this.props.requested_test;

  samples ="";
  for (var i = 0, len = encounter.samples.length; i < len; i++) {
    if (i>0) {
      samples +=",";
    }
  //  samples += encounter.samples[i].uuid;

//TODO what is do when this.props.sample.entity_ids.length>1???
samples += encounter.samples[i].entity_ids[0]
  }

  created_at = new Date(Date.parse(test.created_at));
  created_at_date=created_at.toISOString().slice(0, 10);

  return (
    <tr>
      <td>{test.name}</td>
      <td>{encounter.uuid}</td>
      <td>{encounter.site["uuid"]}</td>
      <td>{samples}</td>
      <td>{this.props.requested_by}</td>
      <td>{created_at_date}</td>
      <td>{encounter.testdue_date}</td>
      <td>{test.status}</td>
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
          <col width="10%" />
          <col width="10%" />
          <col width="20%" />
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
          </tr>
        </thead>
        <tbody>
          {this.props.requested_tests.map(function(requested_test) {
             return <RequestedTestRow key={requested_test.id} requested_test={requested_test}
              encounter={this.props.encounter} requested_by={this.props.requested_by} />;
          }.bind(this))}
        </tbody>
      </table>
    );
  }
});

var RequestedTestsIndexTable = React.createClass({
  render: function() {
    return <RequestedTestsList requested_tests={this.props.requested_tests} encounter={this.props.encounter}
              title={this.props.title} requested_by={this.props.requested_by} titleClassName="table-title" />
  }
});
