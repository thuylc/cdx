var EncounterStore = Reflux.createStore({
  init: function() {
    this.listenTo(EncounterActions.deleteEncounter, this.onDelete);
  },
 onDelete: function(url,successUrl, errorCallback) {
    $.ajax({
      url: url,
      dataType: 'json',
      type: 'DELETE',
      success: function(data) {
        window.location.href = successUrl;
      }.bind(this),
      error: function(xhr, status, err) {
	      _message_array= extractResponseErrors(xhr.responseText);
        errorCallback(_message_array);
      }.bind(this)
    });
  },
});
