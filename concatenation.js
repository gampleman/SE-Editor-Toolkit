var Diff, Toolbar;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Toolbar = {
  buttons: [],
  clean: function(txt, callback) {
    return txt.split("\n").map(function(line) {
      if (line.match(/^(    +)|\t\s+/)) {
        return line;
      } else if (line.match(/\`.*\`/)) {
        return line.replace(/([^`]*)(`.+`)([^`]*)/g, function() {
          return callback(arguments[1]) + arguments[2] + callback(arguments[3]);
        });
      } else if (line.match(/https?\:\/\//)) {
        return line.replace(/(.*)(https?\:\/\/[^ ]+)(.*)/g, function() {
          return callback(arguments[1]) + arguments[2] + callback(arguments[3]);
        });
      } else {
        return callback(line);
      }
    }).join("\n");
  },
  actOnSelection: function(callback, actOnTitle) {
    var s, txt, _ref;
    if (actOnTitle == null) {
      actOnTitle = false;
    }
    if (this.activeElement.selectionStart === this.activeElement.selectionEnd) {
      this.activeElement.value = callback(this.activeElement.value, false).replace(/^\s+/, "");
    } else {
      s = this.activeElement.selectionStart;
      txt = callback(this.activeElement.value.substring(s, this.activeElement.selectionEnd), true);
      this.activeElement.value = this.activeElement.value.substring(0, s) + txt + this.activeElement.value.substring(this.activeElement.selectionEnd);
      this.activeElement.setSelectionRange(s, s + txt.length);
    }
    if (actOnTitle && this.activeElement !== document.getElementById('title')) {
      if ((_ref = document.getElementById('title')) != null) {
        _ref.value = callback(document.getElementById('title').value);
      }
    }
    Diff.change();
    return Diff.switchToDiff();
  },
  trackActive: function(event) {
    return Toolbar.activeElement = event.target;
  },
  add_button: function(obj) {
    var _ref, _ref2;
    (_ref = obj.id) != null ? _ref : obj.id = obj.name.toLowerCase();
    (_ref2 = obj.title) != null ? _ref2 : obj.title = obj.name;
    Toolbar.buttons.push(obj);
    return obj;
  },
  setup: function() {
    var d, _ref;
    d = document.createElement('div');
    Toolbar.activeElement = document.getElementById('wmd-input');
    Toolbar.activeElement.focus();
    document.getElementById('wmd-input').addEventListener('focus', Toolbar.trackActive, false);
    if ((_ref = document.getElementById('title')) != null) {
      _ref.addEventListener('focus', Toolbar.trackActive, false);
    }
    return Toolbar.buttons.forEach(function(b) {
      d.innerHTML = "<li class=\"wmd-button\" id=\"" + b.id + "-button\" title=\"" + b.title + "\"\nstyle=\"background-position: 15px -200px; right: " + b.pos + "px; top: 3px\">\n  <a href=\"#\">" + b.name + "</a>\n</li>";
      document.querySelector('#wmd-button-row').appendChild(d.children[0]);
      return document.getElementById("" + b.id + "-button").addEventListener('click', function(ev) {
        ev.preventDefault();
        return b.callback();
      }, false);
    });
  }
};
window.addEventListener('load', Toolbar.setup, false);
Diff = {
  change: function() {
    var el;
    el = document.querySelector('#post-editor>#diff');
    return el.innerHTML = diffString(this.orig, this.theString());
  },
  toggleMode: function() {
    if (this.previewing) {
      this.switchToDiff();
    } else {
      this.switchToPreview();
    }
    return false;
  },
  theString: function() {
    if (document.getElementById('title')) {
      return "#" + (document.getElementById('title').value) + "\n\n" + (escape(document.getElementById('wmd-input').value));
    } else {
      return document.getElementById('wmd-input').value;
    }
  },
  switchToDiff: function() {
    if (this.previewing) {
      document.getElementById('wmd-preview').style.display = 'none';
      document.getElementById('diff').style.display = 'block';
      this.toggle.innerText = "Show preview";
    }
    return this.previewing = false;
  },
  switchToPreview: function() {
    if (!this.previewing) {
      document.getElementById('wmd-preview').style.display = 'block';
      document.getElementById('diff').style.display = 'none';
      this.toggle.innerText = "Show diff";
    }
    return this.previewing = true;
  },
  setup: function() {
    var cont, el, _ref, _ref2;
    console.log("setup", this);
    if ((_ref = document.getElementById('title')) != null) {
      _ref.addEventListener('change', __bind(function() {
        return this.change();
      }, this));
    }
    if ((_ref2 = document.getElementById('title')) != null) {
      _ref2.addEventListener('keyup', __bind(function() {
        return this.change();
      }, this));
    }
    document.getElementById('wmd-input').addEventListener('change', __bind(function() {
      return this.change();
    }, this));
    document.getElementById('wmd-input').addEventListener('keyup', __bind(function() {
      return this.change();
    }, this));
    this.toggle = document.createElement('a');
    this.toggle.addEventListener('click', __bind(function() {
      return this.toggleMode();
    }, this));
    this.toggle.innerText = "Show diff";
    cont = document.createElement('div');
    cont.style.marginTop = "1em";
    cont.appendChild(this.toggle);
    this.previewing = true;
    el = document.createElement('pre');
    el.id = 'diff';
    el.style.whiteSpace = 'pre-wrap';
    el.style.display = 'none';
    document.getElementById('post-editor').appendChild(el);
    document.getElementById('post-editor').insertBefore(cont, document.getElementById('wmd-preview'));
    return this.orig = this.theString();
  }
};
window.addEventListener('load', function() {
  return Diff.setup.apply(Diff);
});
Toolbar.add_button({
  name: 'Autocorrect',
  pos: 80,
  callback: function() {
    return Toolbar.actOnSelection(function(txt, isSelection) {
      return Toolbar.clean(txt.replace(/\t/g, "    "), function(line) {
        var words;
        words = ["AMD", "AppleScript", "ASUS", "ATI", "Bluetooth", "DivX", "DVD", "Eee PC", "FireWire", "GarageBand", "GHz", "iBookstore", "iCal", "iChat", "iLife", "iMac", "iMovie", "iOS", "iPad", "iPhone", "iPhoto", "iPod", "iTunes", "iWeb", "iWork", "JavaScript", "jQuery", "Lenovo", "MacBook", "MacPorts", "MHz", "MobileMe", "MySQL", "Nvidia", "OS X", "PowerBook", "PowerPoint", "QuickTime", "SSD", "TextEdit", "TextMate", "ThinkPad", "USB", "VMware", "WebKit", "Wi-Fi", "Windows XP", "WordPress", "Xcode", "XMLHttpRequest", "Xserve"];
        return line.replace(/\bi( |')/g, "I$1").replace(/\bi ?m\b/ig, "I'm").replace(/\bu\b/g, "you").replace(/\bur\b/g, "your").replace(/\bcud\b/ig, "could").replace(/\bb4\b/ig, "before").replace(/\bpl[sz]\b/i, "please").replace(/\b(can|doesn|won|hasn|isn|didn)t\b/ig, "$1't").replace(/\b(a)n(?= +(?![aeiou]|HTML|user))/gi, "$1").replace(/\b(a)(?= +[aeiou](?!ser))/gi, "$1n").replace(/\b(a)lot\b/gi, "$1 lot").replace(/^(H(i|[eaiy][yiea]|ell?o)|greet(ings|z))(\sto)?\s?(every(one|body)|expert|geek|all|friend|there|guy|people|folk)?s?\s*[\!\.\,\:]*\s*/ig, "").replace(/^(thx|thanks?|cheers|thanx|tia)\s?((in advance)|you)?[\.\!\,]*/gi, "").replace(/[ ]*([\:\,]) */g, "$1 ").replace(/([\.\?\!] *|^)(?!rb|txt|hs|x?h?t?ml|htaccess|dll|wav|mp3|exe|ini|htpasswd)(.)/g, function() {
          if (arguments[1].length === 0) {
            return arguments[2].toUpperCase();
          } else {
            return arguments[1].trim() + " " + arguments[2].toUpperCase();
          }
        }).replace(/[ ]*\.( ?\.)+ */g, "... ").replace(/[ ]*([\?\!] ?)+ */g, "$1").replace(/\. (\d)/g, ".$1").replace(/\be\.? *G\.?\,? +(.)/gi, function(_, l) {
          return "e.g., " + l.toLowerCase();
        }).replace(/\bi\. *e\. (.)/gi, function(_, l) {
          return "i.e. " + l.toLowerCase();
        }).replace(RegExp('\\b(?:(' + words.join(')|(') + '))\\b', 'ig'), function(m) {
          var a, _results;
          a = arguments.length - 2;
          _results = [];
          while (a--) {
            if (arguments[a]) {
              return words[a - 1] || m;
            }
          }
          return _results;
        });
      });
    }, true);
  }
});
Toolbar.add_button({
  title: "Make code sane",
  id: 'sane',
  name: '&lt;',
  pos: 120,
  callback: function() {
    return Toolbar.actOnSelection(function(txt, isSelection) {
      var indent, _ref;
      txt = txt.replace(/\t/g, "    ").replace(/\n {4,}/g, "\n    ");
      if ((_ref = document.getElementById('tagnames')) != null ? _ref.value.match(/(\b(c|c\#|c\+\+)\b|objective-c|cocoa|java|android|jquery|actionscript|javascript|ecmascript|scala|php|css)/) : void 0) {
        indent = 0;
        txt = txt.replace(/^( {4,})(.*?)(\{?)$/gm, function(_, base, str, bracket) {
          var i;
          if (str.indexOf("}") !== -1) {
            indent--;
          }
          i = 0;
          while (i++ < indent) {
            base += "  ";
          }
          if (bracket === "{") {
            indent++;
          }
          indent = Math.max(indent, 0);
          return base + str + bracket;
        });
      }
      return txt;
    });
  }
});
Toolbar.add_button({
  title: "Search &amp; Replace",
  id: 'snr',
  name: '&#128269;',
  pos: 140,
  callback: function() {
    if (document.getElementById('snr-ui') == null) {
      return this.setupSearchUI();
    } else {
      if (document.getElementById('snr-ui').style.display === 'block') {
        document.getElementById('snr-ui').style.display = 'none';
        return document.querySelector('#wmd-button-bar').style.height = "25px";
      } else {
        document.getElementById('snr-ui').style.display = 'block';
        return document.querySelector('#wmd-button-bar').style.height = "50px";
      }
    }
  },
  doSearch: function() {
    this.recreateRegexp();
    return this.findNext();
  },
  recreateRegexp: function() {
    return this.current_re = RegExp(document.getElementById('search-find').value, this.modifiers(true));
  },
  modifiers: function(global) {
    var base;
    if (global == null) {
      global = false;
    }
    base = "m";
    if (!document.getElementById('search-casesensitive').checked) {
      base += "i";
    }
    if (global) {
      base += "g";
    }
    return base;
  },
  findNext: function() {
    var res;
    res = this.current_re.exec(document.getElementById('wmd-input').value);
    this.last_start = this.current_re.lastIndex - res[0].length;
    return document.getElementById('wmd-input').setSelectionRange(this.last_start, this.current_re.lastIndex);
  },
  setupSearchUI: function() {
    var d;
    d = document.createElement('div');
    d.innerHTML = '<ul id="snr-ui" style="margin: 0; padding: 0">\n  <li class="wmd-button" style="width: 100%; background-image: none">\n    <form id="snr-form" action="#">\n      <input type=text id="search-find" placeholder="Search (regexp)" />\n      <input type=text id="search-replace" placeholder="Replace" />\n      <button id="search-next">Next</button><button id="search-rnf">Replace &amp; Find</button>\n      <button id="search-replaceall">Replace all</button>\n      <input type=checkbox value=1 id="search-casesensitive" />\n      <label for="search-casesensitive">Case sensitive</label>\n    </form>\n  </li>\n</ul>';
    document.querySelector('#wmd-button-bar').appendChild(d.children[0]);
    document.querySelector('#wmd-button-bar').style.height = "50px";
    document.getElementById('search-find').addEventListener('change', (__bind(function() {
      return this.recreateRegexp();
    }, this)), false);
    document.getElementById('search-casesensitive').addEventListener('change', (__bind(function() {
      return this.recreateRegexp();
    }, this)), false);
    document.getElementById('snr-form').addEventListener('submit', __bind(function(ev) {
      ev.preventDefault();
      return this.doSearch();
    }, this), false);
    document.getElementById('search-next').addEventListener('click', __bind(function(ev) {
      ev.preventDefault();
      if (this.current_re == null) {
        return this.doSearch();
      } else {
        return this.findNext();
      }
    }, this));
    document.getElementById('search-rnf').addEventListener('click', __bind(function(ev) {
      var el, re;
      ev.preventDefault();
      el = document.getElementById('wmd-input');
      if (!(this.current_re != null) || el.selectionStart === el.selectionEnd) {
        this.doSearch();
      }
      re = RegExp(document.getElementById('search-find').value, this.modifiers());
      el.value = el.value.substring(0, el.selectionStart) + el.value.substring(el.selectionStart, el.selectionEnd).replace(re, document.getElementById('search-replace').value) + el.value.substring(el.selectionEnd);
      this.findNext();
      return Diff.change();
    }, this));
    return document.getElementById('search-replaceall').addEventListener('click', __bind(function(ev) {
      var el;
      ev.preventDefault();
      el = document.getElementById('wmd-input');
      el.value = el.value.replace(this.current_re, document.getElementById('search-replace').value);
      Diff.change();
      return Diff.switchToDiff();
    }, this));
  }
});
/*
To Title Case 1.1.1
David Gouch <http://individed.com>
23 May 2008
License: http://individed.com/code/to-title-case/license.txt

In response to John Gruber's call for a Javascript version of his script:
http://daringfireball.net/2008/05/title_case
*/
String.prototype.toTitleCase = function() {
  return this.toLowerCase().replace(/([\w&`'‘’"“.@:\/\{\(\[<>_]+-? *)/g, function(match, p1, index, title) {
    if (index > 0 && title.charAt(index - 2) !== ":" && match.search(/^(a(nd?|s|t)?|b(ut|y)|en|for|i[fn]|o[fnr]|t(he|o)|vs?\.?|via)[ \-]/i) > -1) {
      return match.toLowerCase();
    } else if (title.substring(index - 1, index + 1).search(/['"_{(\[]/) > -1) {
      return match.charAt(0) + match.charAt(1).toUpperCase() + match.substr(2);
    } else if (match.substr(1).search(/[A-Z]+|&|[\w]+[._][\w]+/) > -1 || title.substring(index - 1, index + 1).search(/[\])}]/) > -1) {
      return match;
    } else {
      return match.charAt(0).toUpperCase() + match.substr(1);
    }
  });
};
Toolbar.add_button({
  title: "Toggle case",
  id: 'case',
  name: '&darr;',
  pos: 100,
  callback: function() {
    return Toolbar.actOnSelection(function(txt, isSelection) {
      if (isSelection) {
        if ((txt.toLowerCase() === txt && txt === txt.toTitleCase())) {
          return txt.toUpperCase();
        } else if (txt.toLowerCase() === txt) {
          return txt.toTitleCase();
        } else if (txt.toTitleCase() === txt) {
          return txt.toUpperCase();
        } else {
          return txt.toLowerCase();
        }
      } else {
        return Toolbar.clean(txt, function(line) {
          return line.replace(/([A-Z])([A-Z]+)/g, function(_, first, rest) {
            return first + rest.toLowerCase();
          });
        });
      }
    });
  }
});/*
 * Javascript Diff Algorithm
 *  By John Resig (http://ejohn.org/)
 *  Modified by Chu Alan "sprite"
 *
 * Released under the MIT license.
 *
 * More Info:
 *  http://ejohn.org/projects/javascript-diff-algorithm/
 */

function escape(s) {
    var n = s;
    n = n.replace(/&/g, "&amp;");
    n = n.replace(/</g, "&lt;");
    n = n.replace(/>/g, "&gt;");
    n = n.replace(/"/g, "&quot;");

    return n;
}

function diffString( o, n ) {
  o = o.replace(/\s+$/, '');
  n = n.replace(/\s+$/, '');

  var out = diff(o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/) );
  var str = "";

  var oSpace = o.match(/\s+/g);
  if (oSpace == null) {
    oSpace = ["\n"];
  } else {
    oSpace.push("\n");
  }
  var nSpace = n.match(/\s+/g);
  if (nSpace == null) {
    nSpace = ["\n"];
  } else {
    nSpace.push("\n");
  }

  if (out.n.length == 0) {
      for (var i = 0; i < out.o.length; i++) {
        str += '<span class="diff-delete">' + out.o[i] + oSpace[i] + "</span>";
      }
  } else {
    if (out.n[0].text == null) {
      for (n = 0; n < out.o.length && out.o[n].text == null; n++) {
        str += '<span class="diff-delete">' + out.o[n] + oSpace[n] + "</span>";
      }
    }

    for ( var i = 0; i < out.n.length; i++ ) {
      if (out.n[i].text == null) {
        str += '<span class="diff-add">' + out.n[i] + nSpace[i] + "</span>";
      } else {
        var pre = "";

        for (n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++ ) {
          pre += '<span class="diff-delete">' + out.o[n] + oSpace[n] + "</span>";
        }
        str += " " + out.n[i].text + nSpace[i] + pre;
      }
    }
  }
  
  return str;
}

function randomColor() {
    return "rgb(" + (Math.random() * 100) + "%, " + 
                    (Math.random() * 100) + "%, " + 
                    (Math.random() * 100) + "%)";
}
function diffString2( o, n ) {
  o = o.replace(/\s+$/, '');
  n = n.replace(/\s+$/, '');

  var out = diff(o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/) );

  var oSpace = o.match(/\s+/g);
  if (oSpace == null) {
    oSpace = ["\n"];
  } else {
    oSpace.push("\n");
  }
  var nSpace = n.match(/\s+/g);
  if (nSpace == null) {
    nSpace = ["\n"];
  } else {
    nSpace.push("\n");
  }

  var os = "";
  var colors = new Array();
  for (var i = 0; i < out.o.length; i++) {
      colors[i] = randomColor();

      if (out.o[i].text != null) {
          os += '<span style="background-color: ' +colors[i]+ '">' + 
                escape(out.o[i].text) + oSpace[i] + "</span>";
      } else {
          os += "<del>" + escape(out.o[i]) + oSpace[i] + "</del>";
      }
  }

  var ns = "";
  for (var i = 0; i < out.n.length; i++) {
      if (out.n[i].text != null) {
          ns += '<span style="background-color: ' +colors[out.n[i].row]+ '">' + 
                escape(out.n[i].text) + nSpace[i] + "</span>";
      } else {
          ns += "<ins>" + escape(out.n[i]) + nSpace[i] + "</ins>";
      }
  }

  return { o : os , n : ns };
}

function diff( o, n ) {
  var ns = new Object();
  var os = new Object();
  
  for ( var i = 0; i < n.length; i++ ) {
    if ( ns[ n[i] ] == null )
      ns[ n[i] ] = { rows: new Array(), o: null };
    ns[ n[i] ].rows.push( i );
  }
  
  for ( var i = 0; i < o.length; i++ ) {
    if ( os[ o[i] ] == null )
      os[ o[i] ] = { rows: new Array(), n: null };
    os[ o[i] ].rows.push( i );
  }
  
  for ( var i in ns ) {
    if ( ns[i].rows.length == 1 && typeof(os[i]) != "undefined" && os[i].rows.length == 1 ) {
      n[ ns[i].rows[0] ] = { text: n[ ns[i].rows[0] ], row: os[i].rows[0] };
      o[ os[i].rows[0] ] = { text: o[ os[i].rows[0] ], row: ns[i].rows[0] };
    }
  }
  
  for ( var i = 0; i < n.length - 1; i++ ) {
    if ( n[i].text != null && n[i+1].text == null && n[i].row + 1 < o.length && o[ n[i].row + 1 ].text == null && 
         n[i+1] == o[ n[i].row + 1 ] ) {
      n[i+1] = { text: n[i+1], row: n[i].row + 1 };
      o[n[i].row+1] = { text: o[n[i].row+1], row: i + 1 };
    }
  }
  
  for ( var i = n.length - 1; i > 0; i-- ) {
    if ( n[i].text != null && n[i-1].text == null && n[i].row > 0 && o[ n[i].row - 1 ].text == null && 
         n[i-1] == o[ n[i].row - 1 ] ) {
      n[i-1] = { text: n[i-1], row: n[i].row - 1 };
      o[n[i].row-1] = { text: o[n[i].row-1], row: i - 1 };
    }
  }
  
  return { o: o, n: n };
}

