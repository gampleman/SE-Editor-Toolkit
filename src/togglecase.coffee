###
To Title Case 1.1.1
David Gouch <http://individed.com>
23 May 2008
License: http://individed.com/code/to-title-case/license.txt

In response to John Gruber's call for a Javascript version of his script: 
http://daringfireball.net/2008/05/title_case
###
String.prototype.toTitleCase = ->
  @toLowerCase().replace /([\w&`'‘’"“.@:\/\{\(\[<>_]+-? *)/g, (match, p1, index, title) ->
    if index > 0 && title.charAt(index - 2) != ":" && match.search(/^(a(nd?|s|t)?|b(ut|y)|en|for|i[fn]|o[fnr]|t(he|o)|vs?\.?|via)[ \-]/i) > -1
      match.toLowerCase()
    else if title.substring(index - 1, index + 1).search(/['"_{(\[]/) > -1
      match.charAt(0) + match.charAt(1).toUpperCase() + match.substr(2)
    else if match.substr(1).search(/[A-Z]+|&|[\w]+[._][\w]+/) > -1 || title.substring(index - 1, index + 1).search(/[\])}]/) > -1
      match
    else
      match.charAt(0).toUpperCase() + match.substr(1)

Toolbar.add_button
  title: "Toggle case"
  id:    'case'
  name:  '&darr;'
  pos:   100
  callback: ->
    Toolbar.actOnSelection (txt, isSelection) ->
      if isSelection
        if txt.toLowerCase() == txt
          txt.toTitleCase()
        else if txt.toTitleCase() == txt
          txt.toUpperCase()
        else
          txt.toLowerCase()
      else 
        Toolbar.clean txt, (line) ->
          line.replace /([A-Z])([A-Z]+)/g, (_, first, rest) ->
            first + rest.toLowerCase()
