//  http://www.sitepoint.com/creating-note-taking-app-react-flux/

function extractResponseErrors(responseText) {
		var _message_array = new Array();
		var _raw_messages = responseText;
		  if (_raw_messages) {
		    var _json_messages = JSON.parse(_raw_messages);
		    count = 0
		    for (var key in _json_messages) {
		      _message_array[count] = new Array();
		      _message_array[count][0] = key;
		      _message_array[count][1] = _json_messages[key];
		      count += 1;
		    }
		  }
		return _message_array;
}

var EncounterStore = Reflux.createStore({
  //TODO listenables: [Actions],

  init: function() {
    // Here we listen to actions and register callbacks
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
