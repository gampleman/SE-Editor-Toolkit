add_button({
  title: "Make code sane",
  id: 'sane',
  name: '&lt;',
  pos: 120,
  callback: function() {
    actOnSelection(function(txt, isSelection) { 
      return txt.split("\n").map(function(line) {
        return line.replace(/\t/g, "    ").replace(/ {4,}/, "    ");
      }).join("\n");
    }, false);
  }
});