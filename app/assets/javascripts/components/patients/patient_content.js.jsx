var PatientContent = React.createClass({
  render: function(){
    return(
      <div className="row">
        <div className="col-12">
          {this.props.currentTab === 1 ?
            <p>Content for tab 1</p>
            :null}

          {this.props.currentTab === 2 ?
            <p>Content for tab 2</p>
            :null}

          {this.props.currentTab === 3 ?
            <p>Content for tab 3</p>
            :null}

          {this.props.currentTab === 4 ?
            <PatientComments commentsUrl={this.props.commentsUrl}/>
            :null}
        </div>
      </div>
    );
  }
});
