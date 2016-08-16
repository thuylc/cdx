var PatientResultRow = React.createClass({
  render: function() {
    var that = this;

    return (
    <tr data-href={this.props.patient.viewLink}>
      <td>{this.props.patient.name}</td>
      <td>{this.props.patient.entityId}</td>
      <td>{this.props.patient.dateOfBirth}</td>
      <td>
        {
          this.props.searchTerm ?
            this.props.patient.addresses.map( function(address, index) {
              return(
                <TextHighlight highlight={that.props.searchTerm} text={address} key={index} />
              )
            }) :
            this.props.patient.addresses.map( function(address, index) {
              return(
                <p key={index} className="text-highlight">
                  {address}
                </p>
              )
            })
        }
      </td>
    </tr>);
  }
});

var PatientsIndexTable = React.createClass({
  getDefaultProps: function() {
    return {
      title: I18n.t("components.patients.col_title"),
      allowSorting: true,
      orderBy: "patients.name"
    }
  },

  componentDidMount: function() {
    $("table").resizableColumns({store: window.store});
  },

  render: function() {
    var rows           = [];
    var sortableHeader = function (title, field) {
      return <SortableColumnHeader title={title} field={field} orderBy={this.props.orderBy} />
    }.bind(this);

    this.props.patients.forEach(
      function(patient) {
        rows.push(<PatientResultRow key={patient.id} patient={patient} searchTerm={this.props.searchTerm} />);
      }.bind(this)
    );

    return (
      <table className="table" cellPadding="0" cellSpacing="0" data-resizable-columns-id="patients-table">
        <thead>
          <tr>
            {sortableHeader(I18n.t("components.patients.col_name"), "patients.name")}
            {sortableHeader(I18n.t("components.patients.col_patient_id"), "patients.entity_id")}
            {sortableHeader(I18n.t("components.patients.col_date_of_birth"), "patients.birth_date_on")}
            {sortableHeader(I18n.t("components.patients.col_address"), "patients.address")}
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
});
