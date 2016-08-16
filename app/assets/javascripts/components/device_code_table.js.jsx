var DeviceRow = React.createClass({
  render: function() {
    var data = this.props.row_data;
    return (
      <tr key={this.props.index}>
        <td>{data['device']}</td>
        <td>{data['location']}</td>
        <td>{data['error_code']}</td>
        <td>{data['count']}</td>
        <td>{data['last_error']}</td>
      </tr>);
    }
  });


  var DeviceErrorTable = React.createClass({
    getInitialState: function() {
      appendTitle=[{"device":""},
      {"location":""},
      {"error_code":""},
      {"count":""},
      {"last_error":""} ];

      appendTitleDirection=[{"device":""},
      {"location":""},
      {"error_code":""},
      {"count":""},
      {"last_error":""} ];

      appendTitleSelected=[{"device":true},
      {"location":false},
      {"error_code":false},
      {"count":false},
      {"last_error":false} ];

      if (this.props.data.length==0) {
        shouldHide=true;
      } else {
        shouldHide=false;
      }

      return {
        data: this.props.data,
        appendTitle: appendTitle,
        appendTitleDirection: appendTitleDirection,
        appendTitleSelected: appendTitleSelected,
        shouldHide: shouldHide
      };
    },

    getDefaultProps: function() {
      return {
        title: "Tests",
        allowSorting: false,
        orderBy: ""
      }
    },

    setAppendTitleDirection : function(header,value, direction) {
      tempAppendTitle = this.state.appendTitle;
      tempAppendTitleDirection = this.state.appendTitleDirection;
      tempAppendTitleSelected = this.state.appendTitleSelected;

      for (var key in tempAppendTitle) {
        tempAppendTitle[key]="";
        appendTitleSelected[key]=false;
      }

      tempAppendTitle[header]=value;
      this.setState({appendTitle: tempAppendTitle});

      tempAppendTitleDirection[header]=direction;
      this.setState({appendTitleDirection: tempAppendTitleDirection});

      tempAppendTitleSelected[header]=true;
      this.setState({appendTitleSelected: tempAppendTitleSelected});
    },

    reorderData: function(new_data) {
      this.setState({data: new_data});
    },

    randomString: function(){
      return Math.random().toString(36);
    },

    componentDidMount: function() {
      $("table").resizableColumns({store: window.store});
    },
    render: function() {
      var sortableHeader = function (title, field) {
        if (this.props.allowSorting) {
          return <ClientSideSortableColumnHeader  appendTitleSelected={this.state.appendTitleSelected} appendTitle={this.state.appendTitle} appendTitleDirection={this.state.appendTitleDirection} setAppendTitle={this.setAppendTitleDirection} title={title} field={field} orderBy={"-device"} data={this.state.data}  reorderData={this.reorderData} />
        } else {
          return <th>{title}</th>;
          }
        }.bind(this);

        if(this.state.shouldHide)
        {
          return (
            <div>
              <span className="horizontal-bar-value">{I18n.t("components.device_code_table.no_data_msg")}</span>
            </div>
          );
        }
        else
        {
          return (
            <div className="table_scroll_container {this.state.shouldHide ? 'hidden' : ''}">
              <table className="table scroll" cellPadding="0" cellSpacing="0" data-resizable-columns-id="device-error-codes-table">
                <thead>
                  <tr>
                    {sortableHeader(I18n.t("components.device_code_table.device_col"), "device")}
                    {sortableHeader(I18n.t("components.device_code_table.location_col"), "location")}
                    {sortableHeader(I18n.t("components.device_code_table.error_code_col"), "error_code")}
                    {sortableHeader(I18n.t("components.device_code_table.error_count_col"), "count")}
                    {sortableHeader(I18n.t("components.device_code_table.last_eror_col"), "last_error")}
                  </tr>
                </thead>
                <tbody key={this.randomString()} >
                  {this.state.data.map(function(row_data,index) {
                    return <DeviceRow key={index} row_data={row_data} />;
                  }.bind(this))}
                </tbody>
              </table>
            </div>
          );
        }
      }
    });
