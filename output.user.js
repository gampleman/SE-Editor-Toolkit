// ==UserScript==
// @name          SE Editor Toolkit
// @author        Jakub Hampl (adapted by Nathan Osman)
// @namespace     http://quickmediasolutions.com
// @description      Provides enhanced editing tools to the post editor
// @include       http://stackoverflow.com/posts/*/edit*
// @include       http://meta.stackoverflow.com/posts/*/edit*
// @include       http://superuser.com/posts/*/edit*
// @include       http://serverfault.com/posts/*/edit*
// @include       http://askubuntu.com/posts/*/edit*
// @include       http://stackapps.com/posts/*/edit*
// @include       http://*.stackexchange.com/posts/*/edit*
// ==/UserScript==

var exec_script = document.createElement('script');
exec_script.type = 'text/javascript';
exec_script.textContent = "var load_functions = new Array();\nfunction RegisterLoadFunction(item, ignored) { load_functions.push(item); }\nvar Diff, Toolbar;\nvar __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };\nToolbar = {\n  buttons: [],\n  clean: function(txt, callback) {\n    return txt.split(\"\\n\").map(function(line) {\n      if (line.match(/^(    +)|\\t\\s+/)) {\n        return line;\n      } else if (line.match(/\\`.*\\`/)) {\n        return line.replace(/([^`]*)(`.+`)([^`]*)/g, function() {\n          return callback(arguments[1]) + arguments[2] + callback(arguments[3]);\n        });\n      } else if (line.match(/https?\\:\\/\\//)) {\n        return line.replace(/(.*)(https?\\:\\/\\/[^ ]+)(.*)/g, function() {\n          return callback(arguments[1]) + arguments[2] + callback(arguments[3]);\n        });\n      } else {\n        return callback(line);\n      }\n    }).join(\"\\n\");\n  },\n  actOnSelection: function(callback, actOnTitle) {\n    var s, txt, _ref;\n    if (actOnTitle == null) {\n      actOnTitle = false;\n    }\n    if (this.activeElement.selectionStart === this.activeElement.selectionEnd) {\n      this.activeElement.value = callback(this.activeElement.value, false).replace(/^\\s+/, \"\");\n    } else {\n      s = this.activeElement.selectionStart;\n      txt = callback(this.activeElement.value.substring(s, this.activeElement.selectionEnd), true);\n      this.activeElement.value = this.activeElement.value.substring(0, s) + txt + this.activeElement.value.substring(this.activeElement.selectionEnd);\n      this.activeElement.setSelectionRange(s, s + txt.length);\n    }\n    if (actOnTitle && this.activeElement !== document.getElementById('title')) {\n      if ((_ref = document.getElementById('title')) != null) {\n        _ref.value = callback(document.getElementById('title').value);\n      }\n    }\n    Diff.change();\n    return Diff.switchToDiff();\n  },\n  trackActive: function(event) {\n    return Toolbar.activeElement = event.target;\n  },\n  add_button: function(obj) {\n    var _ref, _ref2;\n    (_ref = obj.id) != null ? _ref : obj.id = obj.name.toLowerCase();\n    (_ref2 = obj.title) != null ? _ref2 : obj.title = obj.name;\n    Toolbar.buttons.push(obj);\n    return obj;\n  },\n  setup: function() {\n    var d, _ref;\n    d = document.createElement('div');\n    Toolbar.activeElement = document.getElementById('wmd-input');\n    Toolbar.activeElement.focus();\n    document.getElementById('wmd-input').addEventListener('focus', Toolbar.trackActive, false);\n    if ((_ref = document.getElementById('title')) != null) {\n      _ref.addEventListener('focus', Toolbar.trackActive, false);\n    }\n    return Toolbar.buttons.forEach(function(b) {\n      d.innerHTML = \"<li class=\\\"wmd-button\\\" id=\\\"\" + b.id + \"-button\\\" title=\\\"\" + b.title + \"\\\"\\nstyle=\\\"background-position: 15px -200px; right: \" + b.pos + \"px; top: 3px\\\">\\n  <a href=\\\"#\\\">\" + b.name + \"</a>\\n</li>\";\n      document.querySelector('#wmd-button-row').appendChild(d.children[0]);\n      return document.getElementById(\"\" + b.id + \"-button\").addEventListener('click', function(ev) {\n        ev.preventDefault();\n        return b.callback();\n      }, false);\n    });\n  }\n};\nRegisterLoadFunction( Toolbar.setup, false);\nDiff = {\n  change: function() {\n    var el;\n    el = document.querySelector('#post-editor>#diff');\n    return el.innerHTML = diffString(this.orig, this.theString());\n  },\n  toggleMode: function() {\n    if (this.previewing) {\n      this.switchToDiff();\n    } else {\n      this.switchToPreview();\n    }\n    return false;\n  },\n  theString: function() {\n    if (document.getElementById('title')) {\n      return \"#\" + (document.getElementById('title').value) + \"\\n\\n\" + (escape(document.getElementById('wmd-input').value));\n    } else {\n      return document.getElementById('wmd-input').value;\n    }\n  },\n  switchToDiff: function() {\n    if (this.previewing) {\n      document.getElementById('wmd-preview').style.display = 'none';\n      document.getElementById('diff').style.display = 'block';\n      this.toggle.innerText = \"Show preview\";\n    }\n    return this.previewing = false;\n  },\n  switchToPreview: function() {\n    if (!this.previewing) {\n      document.getElementById('wmd-preview').style.display = 'block';\n      document.getElementById('diff').style.display = 'none';\n      this.toggle.innerText = \"Show diff\";\n    }\n    return this.previewing = true;\n  },\n  setup: function() {\n    var cont, el, _ref, _ref2;\n    console.log(\"setup\", this);\n    if ((_ref = document.getElementById('title')) != null) {\n      _ref.addEventListener('change', __bind(function() {\n        return this.change();\n      }, this));\n    }\n    if ((_ref2 = document.getElementById('title')) != null) {\n      _ref2.addEventListener('keyup', __bind(function() {\n        return this.change();\n      }, this));\n    }\n    document.getElementById('wmd-input').addEventListener('change', __bind(function() {\n      return this.change();\n    }, this));\n    document.getElementById('wmd-input').addEventListener('keyup', __bind(function() {\n      return this.change();\n    }, this));\n    this.toggle = document.createElement('a');\n    this.toggle.addEventListener('click', __bind(function() {\n      return this.toggleMode();\n    }, this));\n    this.toggle.innerText = \"Show diff\";\n    cont = document.createElement('div');\n    cont.style.marginTop = \"1em\";\n    cont.appendChild(this.toggle);\n    this.previewing = true;\n    el = document.createElement('pre');\n    el.id = 'diff';\n    el.style.whiteSpace = 'pre-wrap';\n    el.style.display = 'none';\n    document.getElementById('post-editor').appendChild(el);\n    document.getElementById('post-editor').insertBefore(cont, document.getElementById('wmd-preview'));\n    return this.orig = this.theString();\n  }\n};\nwindow.addEventListener('load', function() {\n  return Diff.setup.apply(Diff);\n});\nToolbar.add_button({\n  name: 'Autocorrect',\n  pos: 80,\n  callback: function() {\n    return Toolbar.actOnSelection(function(txt, isSelection) {\n      return Toolbar.clean(txt.replace(/\\t/g, \"    \"), function(line) {\n        var words;\n        words = [\"AMD\", \"AppleScript\", \"ASUS\", \"ATI\", \"Bluetooth\", \"DivX\", \"DVD\", \"Eee PC\", \"FireWire\", \"GarageBand\", \"GHz\", \"iBookstore\", \"iCal\", \"iChat\", \"iLife\", \"iMac\", \"iMovie\", \"iOS\", \"iPad\", \"iPhone\", \"iPhoto\", \"iPod\", \"iTunes\", \"iWeb\", \"iWork\", \"JavaScript\", \"jQuery\", \"Lenovo\", \"MacBook\", \"MacPorts\", \"MHz\", \"MobileMe\", \"MySQL\", \"Nvidia\", \"OS X\", \"PowerBook\", \"PowerPoint\", \"QuickTime\", \"SSD\", \"TextEdit\", \"TextMate\", \"ThinkPad\", \"USB\", \"VMware\", \"WebKit\", \"Wi-Fi\", \"Windows XP\", \"WordPress\", \"Xcode\", \"XMLHttpRequest\", \"Xserve\"];\n        return line.replace(/\\bi( |')/g, \"I$1\").replace(/\\bi ?m\\b/ig, \"I'm\").replace(/\\bu\\b/g, \"you\").replace(/\\bur\\b/g, \"your\").replace(/\\bcud\\b/ig, \"could\").replace(/\\bb4\\b/ig, \"before\").replace(/\\bpl[sz]\\b/i, \"please\").replace(/\\b(can|doesn|won|hasn|isn|didn)t\\b/ig, \"$1't\").replace(/\\b(a)n(?= +(?![aeiou]|HTML|user))/gi, \"$1\").replace(/\\b(a)(?= +[aeiou](?!ser))/gi, \"$1n\").replace(/\\b(a)lot\\b/gi, \"$1 lot\").replace(/^(H(i|[eaiy][yiea]|ell?o)|greet(ings|z))(\\sto)?\\s?(every(one|body)|expert|geek|all|friend|there|guy|people|folk)?s?\\s*[\\!\\.\\,\\:]*\\s*/ig, \"\").replace(/^(thx|thanks?|cheers|thanx|tia)\\s?((in advance)|you)?[\\.\\!\\,]*/gi, \"\").replace(/[ ]*([\\:\\,]) */g, \"$1 \").replace(/([\\.\\?\\!] *|^)(?!rb|txt|hs|x?h?t?ml|htaccess|dll|wav|mp3|exe|ini|htpasswd)(.)/g, function() {\n          if (arguments[1].length === 0) {\n            return arguments[2].toUpperCase();\n          } else {\n            return arguments[1].trim() + \" \" + arguments[2].toUpperCase();\n          }\n        }).replace(/[ ]*\\.( ?\\.)+ */g, \"... \").replace(/[ ]*([\\?\\!] ?)+ */g, \"$1\").replace(/\\. (\\d)/g, \".$1\").replace(/\\be\\.? *G\\.?\\,? +(.)/gi, function(_, l) {\n          return \"e.g., \" + l.toLowerCase();\n        }).replace(/\\bi\\. *e\\. (.)/gi, function(_, l) {\n          return \"i.e. \" + l.toLowerCase();\n        }).replace(RegExp('\\\\b(?:(' + words.join(')|(') + '))\\\\b', 'ig'), function(m) {\n          var a, _results;\n          a = arguments.length - 2;\n          _results = [];\n          while (a--) {\n            if (arguments[a]) {\n              return words[a - 1] || m;\n            }\n          }\n          return _results;\n        });\n      });\n    }, true);\n  }\n});\nToolbar.add_button({\n  title: \"Make code sane\",\n  id: 'sane',\n  name: '&lt;',\n  pos: 120,\n  callback: function() {\n    return Toolbar.actOnSelection(function(txt, isSelection) {\n      var indent, _ref;\n      txt = txt.replace(/\\t/g, \"    \").replace(/\\n {4,}/g, \"\\n    \");\n      if ((_ref = document.getElementById('tagnames')) != null ? _ref.value.match(/(\\b(c|c\\#|c\\+\\+)\\b|objective-c|cocoa|java|android|jquery|actionscript|javascript|ecmascript|scala|php|css)/) : void 0) {\n        indent = 0;\n        txt = txt.replace(/^( {4,})(.*?)(\\{?)$/gm, function(_, base, str, bracket) {\n          var i;\n          if (str.indexOf(\"}\") !== -1) {\n            indent--;\n          }\n          i = 0;\n          while (i++ < indent) {\n            base += \"  \";\n          }\n          if (bracket === \"{\") {\n            indent++;\n          }\n          indent = Math.max(indent, 0);\n          return base + str + bracket;\n        });\n      }\n      return txt;\n    });\n  }\n});\nToolbar.add_button({\n  title: \"Search &amp; Replace\",\n  id: 'snr',\n  name: '&#128269;',\n  pos: 140,\n  callback: function() {\n    if (document.getElementById('snr-ui') == null) {\n      return this.setupSearchUI();\n    } else {\n      if (document.getElementById('snr-ui').style.display === 'block') {\n        document.getElementById('snr-ui').style.display = 'none';\n        return document.querySelector('#wmd-button-bar').style.height = \"25px\";\n      } else {\n        document.getElementById('snr-ui').style.display = 'block';\n        return document.querySelector('#wmd-button-bar').style.height = \"50px\";\n      }\n    }\n  },\n  doSearch: function() {\n    this.recreateRegexp();\n    return this.findNext();\n  },\n  recreateRegexp: function() {\n    return this.current_re = RegExp(document.getElementById('search-find').value, this.modifiers(true));\n  },\n  modifiers: function(global) {\n    var base;\n    if (global == null) {\n      global = false;\n    }\n    base = \"m\";\n    if (!document.getElementById('search-casesensitive').checked) {\n      base += \"i\";\n    }\n    if (global) {\n      base += \"g\";\n    }\n    return base;\n  },\n  findNext: function() {\n    var res;\n    res = this.current_re.exec(document.getElementById('wmd-input').value);\n    this.last_start = this.current_re.lastIndex - res[0].length;\n    return document.getElementById('wmd-input').setSelectionRange(this.last_start, this.current_re.lastIndex);\n  },\n  setupSearchUI: function() {\n    var d;\n    d = document.createElement('div');\n    d.innerHTML = '<ul id=\"snr-ui\" style=\"margin: 0; padding: 0\">\\n  <li class=\"wmd-button\" style=\"width: 100%; background-image: none\">\\n    <form id=\"snr-form\" action=\"#\">\\n      <input type=text id=\"search-find\" placeholder=\"Search (regexp)\" />\\n      <input type=text id=\"search-replace\" placeholder=\"Replace\" />\\n      <button id=\"search-next\">Next</button><button id=\"search-rnf\">Replace &amp; Find</button>\\n      <button id=\"search-replaceall\">Replace all</button>\\n      <input type=checkbox value=1 id=\"search-casesensitive\" />\\n      <label for=\"search-casesensitive\">Case sensitive</label>\\n    </form>\\n  </li>\\n</ul>';\n    document.querySelector('#wmd-button-bar').appendChild(d.children[0]);\n    document.querySelector('#wmd-button-bar').style.height = \"50px\";\n    document.getElementById('search-find').addEventListener('change', (__bind(function() {\n      return this.recreateRegexp();\n    }, this)), false);\n    document.getElementById('search-casesensitive').addEventListener('change', (__bind(function() {\n      return this.recreateRegexp();\n    }, this)), false);\n    document.getElementById('snr-form').addEventListener('submit', __bind(function(ev) {\n      ev.preventDefault();\n      return this.doSearch();\n    }, this), false);\n    document.getElementById('search-next').addEventListener('click', __bind(function(ev) {\n      ev.preventDefault();\n      if (this.current_re == null) {\n        return this.doSearch();\n      } else {\n        return this.findNext();\n      }\n    }, this));\n    document.getElementById('search-rnf').addEventListener('click', __bind(function(ev) {\n      var el, re;\n      ev.preventDefault();\n      el = document.getElementById('wmd-input');\n      if (!(this.current_re != null) || el.selectionStart === el.selectionEnd) {\n        this.doSearch();\n      }\n      re = RegExp(document.getElementById('search-find').value, this.modifiers());\n      el.value = el.value.substring(0, el.selectionStart) + el.value.substring(el.selectionStart, el.selectionEnd).replace(re, document.getElementById('search-replace').value) + el.value.substring(el.selectionEnd);\n      this.findNext();\n      return Diff.change();\n    }, this));\n    return document.getElementById('search-replaceall').addEventListener('click', __bind(function(ev) {\n      var el;\n      ev.preventDefault();\n      el = document.getElementById('wmd-input');\n      el.value = el.value.replace(this.current_re, document.getElementById('search-replace').value);\n      Diff.change();\n      return Diff.switchToDiff();\n    }, this));\n  }\n});\n/*\nTo Title Case 1.1.1\nDavid Gouch <http://individed.com>\n23 May 2008\nLicense: http://individed.com/code/to-title-case/license.txt\n\nIn response to John Gruber's call for a Javascript version of his script:\nhttp://daringfireball.net/2008/05/title_case\n*/\nString.prototype.toTitleCase = function() {\n  return this.toLowerCase().replace(/([\\w&`'‘’\"“.@:\\/\\{\\(\\[<>_]+-? *)/g, function(match, p1, index, title) {\n    if (index > 0 && title.charAt(index - 2) !== \":\" && match.search(/^(a(nd?|s|t)?|b(ut|y)|en|for|i[fn]|o[fnr]|t(he|o)|vs?\\.?|via)[ \\-]/i) > -1) {\n      return match.toLowerCase();\n    } else if (title.substring(index - 1, index + 1).search(/['\"_{(\\[]/) > -1) {\n      return match.charAt(0) + match.charAt(1).toUpperCase() + match.substr(2);\n    } else if (match.substr(1).search(/[A-Z]+|&|[\\w]+[._][\\w]+/) > -1 || title.substring(index - 1, index + 1).search(/[\\])}]/) > -1) {\n      return match;\n    } else {\n      return match.charAt(0).toUpperCase() + match.substr(1);\n    }\n  });\n};\nToolbar.add_button({\n  title: \"Toggle case\",\n  id: 'case',\n  name: '&darr;',\n  pos: 100,\n  callback: function() {\n    return Toolbar.actOnSelection(function(txt, isSelection) {\n      if (isSelection) {\n        if ((txt.toLowerCase() === txt && txt === txt.toTitleCase())) {\n          return txt.toUpperCase();\n        } else if (txt.toLowerCase() === txt) {\n          return txt.toTitleCase();\n        } else if (txt.toTitleCase() === txt) {\n          return txt.toUpperCase();\n        } else {\n          return txt.toLowerCase();\n        }\n      } else {\n        return Toolbar.clean(txt, function(line) {\n          return line.replace(/([A-Z])([A-Z]+)/g, function(_, first, rest) {\n            return first + rest.toLowerCase();\n          });\n        });\n      }\n    });\n  }\n});\nfor(var i=0;i<load_functions.length;++i)\n  load_functions[i]();";  document.getElementsByTagName('head')[0].appendChild(exec_script);