Toolbar.add_button 
  title:  "Make code sane"
  id:     'sane'
  name:   '&lt;'
  pos:    120
  callback: ->
    Toolbar.actOnSelection (txt, isSelection) ->
      # basic code sanity (remove tabs, realine completely left)
      txt = txt.replace(/\t/g, "    ").replace(/\n {4,}/g, "\n    ")
      # check if suported language and if so, do more
      if document.getElementById('tagnames')?.value.match /// (
        \b( c | c\# | c\+\+ )\b | objective-c | cocoa |   # C-derivatives
        java | android |                                  # Java
        jquery | actionscript | javascript | ecmascript | # Ecmascript derivatives
        scala | php | css                                 # others (don't be shy to add)
      ) ///                        

        indent = 0
        txt = txt.replace /^( {4,})(.+?)(\{?)$/gm, (t, base, str, bracket) ->
          if str.indexOf("}") != -1 then indent--
          i = 0
          base += "  " while i++ < indent 
          if bracket == "{" then indent++
          indent = Math.max(indent, 0)
          base + str + bracket
      txt
  