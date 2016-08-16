var AddUserLink = React.createClass({
  openInviteModal: function() {
    this.refs.inviteModal.show();
    event.preventDefault();
  },

  closeInviteModal: function() {
    this.refs.inviteModal.hide();
  },

  render: function() {
    return (<div>
      <a className="btn-add icon side-link" href='#' title= {I18n.t("components.users.invite_user_title")} onClick={this.openInviteModal} ><span className="icon-mail icon-white"></span></a>

      <Modal ref="inviteModal">
        <header><h3>{I18n.t("components.users.invite_users_heading")}</h3></header>

        <div className="panel"><UserInviteForm onFinished={this.closeInviteModal} roles={this.props.roles} context={this.props.context} /></div>
      </Modal>
    </div>);
  }
});

var UserInviteForm = React.createClass({
  getInitialState: function() {
    return {
      users: [],
      role: null,
      includeMessage: false,
      message: ""
    };
  },

  sendInvitation: function() {
    var data = {
      users: this.state.users.map(function(i){return i.value}),
      role: this.state.role
    };

    if (data.users.length == 0) {
      data.users = [this.refs.usersList.currentSearch()];
    }

    if(this.state.includeMessage)
      data.message = this.state.message;

    $.ajax({
      url: '/users',
      method: 'POST',
      data: data,
      success: function (d) {
        d = $.parseJSON(d);
        if(d.info.trim().length > 0)
          $('.flashmessage').hide().html(d.info).fadeIn('fast').delay(3000).fadeOut('fast');
        else
        {
          this.closeModal();
          window.location.reload(true); // reload page to update users table
        }
      }.bind(this)
    });
  },

  closeModal: function() {
    this.props.onFinished();
  },

  addUser: function(users) {
    this.setState(React.addons.update(this.state, {
      users: { $set: users }
    }));
  },

  changeRole: function(newValue) {
    this.setState(React.addons.update(this.state, {
      role: { $set: newValue }
    }));
  },

  toggleMessage: function() {
    var oldValue = this.state.includeMessage;
    this.setState(React.addons.update(this.state, {
      includeMessage: { $set: !oldValue }
    }));
  },

  writeMessage: function(event) {
    this.setState(React.addons.update(this.state, {
      message: { $set: event.target.value }
    }));
  },

  render: function() {
    return (<div>
      <div className="row">
        <div className="col pe-2"><label>{I18n.t("components.users.role_label")}</label></div>
        <div className="col"><CdxSelect name="role" items={this.props.roles} value={this.state.role} onChange={this.changeRole} /></div>
      </div>

      <div className="row">
        <div className="col pe-2"><label>{I18n.t("components.users.users_label")}</label></div>
        <div className="col"><OptionList ref="usersList"
          callback={this.addUser}
          autocompleteCallback="/users/autocomplete"
          context={this.props.context}
          allowNonExistent={true}
          showInput={true}
          placeholder= {I18n.t("components.users.type_email_placeholder")} /></div>
      </div>

      <div className="row">
        <div>
          <input id="message-check" type="checkbox" checked={this.state.includeMessage} onChange={this.toggleMessage} />
          <label className="include-message" htmlFor="message-check">{I18n.t("components.users.include_message_label")}</label>
        </div>
      </div>

      { this.state.includeMessage ?
        <div className="row">
          <div className="col pe-2"><label>{I18n.t("components.users.message_label")}</label></div>
          <div className="col"><textarea value={this.state.message} onChange={this.writeMessage} className="input-block resizeable" rows="1" /></div>
        </div> : null }

      <div className="row flashmessage">
      </div>

      <div className="modal-footer">
        <button className="btn btn-primary" onClick={this.sendInvitation}>{I18n.t("components.users.send_btn")}</button>
        <button className="btn btn-link" onClick={this.closeModal}>{I18n.t("components.users.cancel_btn")}</button>
      </div>
    </div>);
  }
});
