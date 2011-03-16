add_button({
  title: "Make code sane",
  id: 'sane',
  name: '&lt;',
  pos: 120,
  callback: function() {
    actOnSelection(function(txt, isSelection) { 
      // basic code sanity (remove tabs, realine completely left)
      txt = txt.replace(/\t/g, "    ").replace(/\n {4,}/g, "\n    ");
      // check if suported language and if so, do more
      if(document.getElementById('tagnames').value.match(
        /(java|\b(c|c\#|c\+\+)\b|objective-c|android|cocoa|jquery|actionscript|scala|php|css)/
      )) {
        var indent = 0;
        txt = txt.replace(/^( {4,})(.+?)(\{?)$/gm, function(t, base, str, bracket) {
          if(str.indexOf("}") != -1)  indent--;
          for (var i=0; i < indent; i++) base += "  ";
          if(bracket == "{") indent++;
          indent = Math.max(indent, 0);
          return base + str + bracket;
        });
      }
      return txt
    }, false);
  }
});