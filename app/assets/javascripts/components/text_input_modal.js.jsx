var TextInputModal = React.createClass({
  getInitialState: function() {
    var button_text="Save";
    if (this.props.edit==false) {
      button_text="Close"; 
    }

    var new_comment = this.props.comment;
    if ( this.props.comment==null) {
       new_comment='';
    }

    return {
      new_comment: new_comment,
      button_text: button_text
    };
  },
  openInviteModal: function() {
    this.refs.inviteModal.show();
    event.preventDefault();
  },
  closeInviteModal: function() {
    this.refs.inviteModal.hide();
  },
  handleChange: function(e) {
    this.setState({
      new_comment: e.currentTarget.value
    });
  },
  handleSave: function() {
    this.refs.inviteModal.hide();
    this.props.commentChanged(this.state.new_comment);
  },
  render: function() {
    return (<div>
      <a className="btn-add icon side-link" href='#' title="Add Comment" onClick={this.openInviteModal} ><span className="icon-pencil icon-white"></span></a>
      <Modal ref="inviteModal">
        <h1>Test Comment</h1>
        <a className = "btn-link" href = "#" onClick={this.handleSave}>{this.state.button_text}</a><br />
        <textarea rows="10" cols="50" placeholder="Add Comment" value={this.state.new_comment} onChange={this.handleChange}
         id = "testcomment" disabled={!this.props.edit} />
      </Modal>
    </div>);
  }
});
