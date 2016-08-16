var DeviceSetup = React.createClass({
  getInitialState: function() {
    return {
      recipient: '',
    };
  },

  showInstructionsModal: function() {
    this.refs.instructionsModal.show();
    event.preventDefault();
  },

  hideInstructionsModal: function() {
    this.refs.instructionsModal.hide();
    event.preventDefault();
  },


  showEmailModal: function() {
    this.setState(React.addons.update(this.state, {
      recipient: { $set: '' }
    }));
    this.refs.emailModal.show();
    event.preventDefault();
  },

  changeRecipient: function(event) {
    this.setState(React.addons.update(this.state, {
      recipient: { $set: event.target.value }
    }));
  },

  sendEmail: function() {
    $.ajax({
      url: '/devices/' + this.props.device.id + '/send_setup_email',
      method: 'POST',
      data: {recipient: this.state.recipient},
      success: function () {
        this.closeEmailModal();
        window.location.reload(true); // reload page in order to hide secret key
      }.bind(this)
    });
    // TODO handle error maybe globally
  },

  closeEmailModal: function() {
    this.refs.emailModal.hide();
    event.preventDefault();
  },

  render: function() {
    var setup_instructions_url = this.props.device_model.setup_instructions_url;
    var setup_instructions_url_node = null;

    if (setup_instructions_url != null && setup_instructions_url != '') {
      setup_instructions_url_node = (<p>I18n.t("components.device_setup.text_1") <a href={this.props.device_model.setup_instructions_url} target="_blank">I18n.t("components.device_setup.text_2")</a></p>)
    }

    var support_url = this.props.device_model.support_url;
    var support_url_node = null;

    if (support_url != null && support_url != '') {
      support_url_node = (<p>I18n.t("components.device_setup.text_3") <a href={this.props.device_model.support_url} target="_blank">I18n.t("components.device_setup.text_4")</a></p>)
    } else {
      support_url_node = (<p>I18n.t("components.device_setup.text_5")</p>)
    }

    return (
      <p>
        <a href='#' onClick={this.showInstructionsModal}>I18n.t("components.device_setup.text_6")</a> I18n.t("components.device_setup.text_7") <a href='#' onClick={this.showEmailModal}>I18n.t("components.device_setup.text_8")</a>.

        <Modal ref="instructionsModal">
          <h1>
            I18n.t("components.device_setup.instructions_heading")
          </h1>

          {setup_instructions_url_node}

          {support_url_node}

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={this.hideInstructionsModal}>I18n.t("components.device_setup.close_btn")</button>
          </div>
        </Modal>

        <Modal ref="emailModal">
          <h1>
            I18n.t("components.device_setup.email_instructions_heading")
          </h1>

          <label>I18n.t("components.device_setup.recipient_label")</label>
          <input type="text" className="input-block" value={this.state.recipient} onChange={this.changeRecipient} />

          <div className="modal-footer">
            <button className="btn btn-primary" onClick={this.sendEmail}>I18n.t("components.device_setup.send_btn")</button>
            <button className="btn btn-link" onClick={this.closeEmailModal}>I18n.t("components.device_setup.cancel_btn")</button>
          </div>
        </Modal>
      </p>
    );
  }
});
