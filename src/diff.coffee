Diff =
  change: ->
    el = document.querySelector('#post-editor>#diff')
    el.innerHTML = diffString(@orig, @theString())

  toggleMode: ->
    if @previewing then @switchToDiff() else @switchToPreview()
    false
    
  theString: ->
    if document.getElementById('title')
      "# #{document.getElementById('title').value}\n\n#{escape(document.getElementById('wmd-input').value)}"
    else
      document.getElementById('wmd-input').value
  
  switchToDiff: ->
    if @previewing
      document.getElementById('wmd-preview').style.display = 'none'
      document.getElementById('diff').style.display = 'block'
      @toggle.innerText = "Show preview"
    @previewing = false
    
  switchToPreview: ->
    unless @previewing
      document.getElementById('wmd-preview').style.display = 'block'
      document.getElementById('diff').style.display = 'none'
      @toggle.innerText = "Show diff"
    @previewing = true
  
  setup: ->
    document.getElementById('title')?.addEventListener('change', proxy(@change, this), false)
    document.getElementById('title')?.addEventListener('keyup', proxy(@change, this), false)
    document.getElementById('wmd-input').addEventListener('change', proxy(@change, this), false)
    document.getElementById('wmd-input').addEventListener('keyup', proxy(@change, this), false)
    @toggle = document.createElement 'a'
    @toggle.addEventListener 'click', proxy(@toggleMode, this), false
    @toggle.innerText = "Show diff"
    cont = document.createElement 'div'
    cont.style.marginTop = "1em"
    cont.appendChild @toggle
    @previewing = true
    el = document.createElement 'pre'
    el.id = 'diff'
    el.style.whiteSpace = 'pre-wrap'
    el.style.display = 'none'
    document.getElementById('post-editor').appendChild(el)
    document.getElementById('post-editor').insertBefore(cont, document.getElementById('wmd-preview'))
    @orig = @theString()


window.addEventListener 'load', proxy(Diff.setup, Diff)