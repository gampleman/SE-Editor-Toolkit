add_button({
  title: "Convert to lowercase",
  id: 'lowercase',
  name: '&darr;',
  pos: 100,
  callback: function() {
    actOnSelection(function(txt, isSelection) { return clean(txt, function(line) {
      if(isSelection) {
        return line.toLowerCase();
      } else {
        return line.replace(/([A-Z])([A-Z]+)/g, function() {return arguments[1] + arguments[2].toLowerCase()});
      }
    }); }, false);
  }
});