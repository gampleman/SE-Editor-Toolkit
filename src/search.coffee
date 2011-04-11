Toolbar.add_button
  title: "Search &amp; Replace"
  id:    'snr'
  name:  '&#128269;'
  pos:   140
  callback: ->
    unless document.getElementById('snr-ui')?
      @setupSearchUI()
    else
      if document.getElementById('snr-ui').style.display == 'block'
        document.getElementById('snr-ui').style.display = 'none'
        document.querySelector('#wmd-button-bar').style.height = "25px"
      else
        document.getElementById('snr-ui').style.display = 'block'
        document.querySelector('#wmd-button-bar').style.height = "50px"

  doSearch: ->
    @recreateRegexp()
    @findNext()

  # Constructs regexp based on fields
  recreateRegexp: ->
    @current_re = RegExp(document.getElementById('search-find').value, @modifiers(true))
  
  # Creates the modifiers part of the regex, pass true to have the global flag
  modifiers: (global = false) ->
    base = "m";
    base += "i" unless document.getElementById('search-casesensitive').checked
    base += "g" if global
    base
    
  # Selects in the text are the next occurence of the search string
  findNext: ->
    res = @current_re.exec(document.getElementById('wmd-input').value);
    @last_start = @current_re.lastIndex - res[0].length;
    document.getElementById('wmd-input').setSelectionRange(@last_start, @current_re.lastIndex);

  setupSearchUI: ->
    d = document.createElement 'div'
    d.innerHTML = '''
    <ul id="snr-ui" style="margin: 0; padding: 0">
      <li class="wmd-button" style="width: 100%; background-image: none">
        <form id="snr-form" action="#">
          <input type=text id="search-find" placeholder="Search (regexp)" />
          <input type=text id="search-replace" placeholder="Replace" />
          <button id="search-next">Next</button><button id="search-rnf">Replace &amp; Find</button>
          <button id="search-replaceall">Replace all</button>
          <input type=checkbox value=1 id="search-casesensitive" />
          <label for="search-casesensitive">Case sensitive</label>
        </form>
      </li>
    </ul>
    '''
    document.querySelector('#wmd-button-bar').appendChild(d.children[0])
    document.querySelector('#wmd-button-bar').style.height = "50px"
  
    # The regex change, recreate it
    document.getElementById('search-find').addEventListener('change', (=> @recreateRegexp()), false)
    document.getElementById('search-casesensitive').addEventListener('change', (=> @recreateRegexp()), false)
    # Enter pressed, comence searching
    document.getElementById('snr-form').addEventListener('submit', (ev) => 
      ev.preventDefault()
      @doSearch()
    , false)
    document.getElementById('search-next').addEventListener 'click', (ev) =>
      ev.preventDefault()
      unless @current_re? then @doSearch() else @findNext()
    document.getElementById('search-rnf').addEventListener 'click', (ev) =>
      ev.preventDefault()
      el = document.getElementById('wmd-input')
      @doSearch() if !@current_re? || el.selectionStart == el.selectionEnd
      re = RegExp(document.getElementById('search-find').value, @modifiers())
      el.value = el.value.substring(0, el.selectionStart) + el.value.substring(el.selectionStart, el.selectionEnd).replace(re, document.getElementById('search-replace').value) + el.value.substring(el.selectionEnd)
      @findNext()
      Diff.change()
    
    document.getElementById('search-replaceall').addEventListener 'click', (ev) =>
      ev.preventDefault()
      el = document.getElementById('wmd-input')
      el.value = el.value.replace(@current_re, document.getElementById('search-replace').value)
      Diff.change()
      Diff.switchToDiff()
