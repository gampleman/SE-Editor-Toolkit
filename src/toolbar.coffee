# Next we define the `Toolbar` object. It's role is to manage all of the buttons and provide common functionality.
Toolbar =
  buttons: [] # Holds the buttons.
  # Takes care of ignoring stuff that should not be changed:
  #  - code blocks
  #  - inline code
  #  - obvious hyperlinks
  # Passes the rest (line-by-line) to `callback`.
  clean: (txt, callback) ->
    txt.split("\n").map (line) ->
      if line.match /^(    +)|\t\s+/ # completely ignore code
        line
      else if line.match /\`.*\`/    # ignore inline code, parse around
        line.replace /([^`]*)(`.+`)([^`]*)/g, ->
          callback(arguments[1]) + arguments[2] + callback(arguments[3]);
      else if line.match /https?\:\/\//  # ignore what looks like urls
        line.replace /(.*)(https?\:\/\/[^ ]+)(.*)/g, ->
          callback(arguments[1]) + arguments[2] + callback(arguments[3]);
      else
        callback(line)
    .join("\n")
  # This function calls `callback(string, actingOnSelection)` either on the entire text of the 
  # main area or only on the current selection of either the main input or the title field. 
  # The mode is indicated by the `actingOnSelection` parameter to the callback. It then sets 
  # the return value of the callback to it's original place and displays the diff.
  # The second argument causes to act on the #title element as well in the non-selection mode.
  actOnSelection: (callback, actOnTitle = false) ->
    if @activeElement.selectionStart == @activeElement.selectionEnd
      @activeElement.value = callback(@activeElement.value, false).replace(/^\s+/, "")
    else # The user has a block of text selected, work only on the selected bit
      s   = @activeElement.selectionStart
      txt = callback(@activeElement.value.substring(s, @activeElement.selectionEnd), true)
      @activeElement.value = @activeElement.value.substring(0, s) + txt  + @activeElement.value.substring(@activeElement.selectionEnd)
      @activeElement.setSelectionRange(s, s + txt.length)
    if actOnTitle && @activeElement != document.getElementById('title')
      document.getElementById('title')?.value = callback(document.getElementById('title').value)
    Diff.change()
    Diff.switchToDiff()
  # Event handler that tracks which element was last selected.
  trackActive: (event) ->
    Toolbar.activeElement = event.target;
  # Constructs a button in the toolbar.
  # Pass an object with the following keys:
  #
  #  - `name`: what's displayed in the toolbar.
  #  - `title`: tooltip [optional].
  #  - `id`: id of the element (will have `-button` apended) [optional].
  #  - `pos`: right offset of the button.
  #  - `callback()`: a function to invoke when the button is clicked.
  add_button: (obj) ->
    obj.id ?= obj.name.toLowerCase()
    obj.title ?= obj.name
    Toolbar.buttons.push(obj)
    obj
  # Called onLoad. Creates the UI.
  setup: ->
    d = document.createElement 'div'
    Toolbar.activeElement = document.getElementById('wmd-input')
    Toolbar.activeElement.focus()
    document.getElementById('wmd-input').addEventListener('focus', Toolbar.trackActive, false)
    document.getElementById('title')?.addEventListener('focus', Toolbar.trackActive, false)

    Toolbar.buttons.forEach (b) ->
      d.innerHTML = """
      <li class="wmd-button" id="#{b.id}-button" title="#{b.title}"
      style="background-position: 15px -200px; right: #{b.pos}px; top: 3px">
        <a href="#">#{b.name}</a>
      </li>
      """
      document.querySelector('#wmd-button-row').appendChild(d.children[0])
      document.getElementById("#{b.id}-button").addEventListener('click', (ev) -> 
        ev.preventDefault()
        b.callback()
      , false)
    
    

  
window.addEventListener 'load', Toolbar.setup, false