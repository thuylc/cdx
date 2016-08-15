var ConfirmationModal = React.createClass({

  modalTitle: function() {
    return this.props.title || (this.props.deletion ? I18n.t("components.confirmation_modal.delete_confirmation_btn") : I18n.t("components.confirmation_modal.confirmation_btn"));
  },

  cancelMessage: function() {
    return this.props.cancelMessage || I18n.t("components.confirmation_modal.cancel_btn");
  },

  confirmMessage: function() {
    return this.props.confirmMessage || (this.props.deletion ? I18n.t("components.confirmation_modal.delete_btn") : I18n.t("components.confirmation_modal.confirm_btn"));
  },

  componentDidMount: function() {
    this.refs.confirmationModal.show();
  },

  onCancel: function() {
    this.refs.confirmationModal.hide();
		if (this.props.target instanceof Function ) {
		this.props.cancel_target();	
	}

  },

  onConfirm: function() {
		if (this.props.target instanceof Function ) {
	  this.props.target();	
	} else {
    window[this.props.target]();
  }
    this.refs.confirmationModal.hide();
  },

  message: function() {
    return {__html: this.props.message};
  },

  confirmButtonClass: function() {
    return this.props.deletion ? "btn-primary btn-danger" : "btn-primary";
  },

  showCancelButton: function() {
    return this.props.hideCancel != true;
  },

  render: function() {
    var cancelButton = null;
    if (this.showCancelButton()) {
      cancelButton = <button type="button" className="btn-link" onClick={this.onCancel}>{this.cancelMessage()}</button>
    }
    return (
      <Modal ref="confirmationModal" show="true">
        <h1>{this.modalTitle()}</h1>
        <div className="modal-content" dangerouslySetInnerHTML={this.message()}>
        </div>
        <div className="modal-footer button-actions">
          <button type="button" className={this.confirmButtonClass()} onClick={this.onConfirm}>{this.confirmMessage()}</button>
          { cancelButton }
        </div>
      </Modal>
    );
  }
});
