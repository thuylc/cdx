$ ->
  observed = $('#episode_initial_history')
  updated = $('#episode_previous_history')
  updated.hide() unless observed.val() == 'previous'
  observed.on 'change', ->
    if observed.val() == 'previous'
      updated.show()
    else
      updated.val('').hide()
