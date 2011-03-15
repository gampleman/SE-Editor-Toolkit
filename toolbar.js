/*
  Takes care of ignoring stuff that should not be changed:
    - code blocks
    - inline code
    - obvious hyperlinks
*/
function clean(txt, callback) {
  return txt.split("\n").map(function(line) {
    // ignore code lines
    if(line.match(/^(    +)|\t\s+/)) { // completely ignore code
      return line;
    } else if(line.match(/\`.*\`/)) { // ignore inline code, parse around
      return line.replace(/([^`]*)(`.+`)([^`]*)/g, function() {
        return callback(arguments[1]) + arguments[2] + callback(arguments[3]);
      });
    } else if(line.match(/https?\:\/\//)) { // ignore what looks like urls
      return line.replace(/(.*)(https?\:\/\/[^ ]+)(.*)/g, function() {
        return callback(arguments[1]) + arguments[2] + callback(arguments[3]);
      });
    } else {
      return callback(line);
    }
  }).join("\n");
}

/*
  Takes the #wmd-input element and calls the callback on the entire text or only on 
  the current selection (which mode is used is indicated by the second argument to
  the callback). It then sets the return back as the value of #wmd-input and displays
  a diff showing the canges.
  Optionally calls the callback on the #title as well.
*/
function actOnSelection (callback, actOnTitle) {
  var el = document.getElementById('wmd-input');
  if(el.selectionStart == el.selectionEnd) {
    el.value = callback(el.value, false).replace(/^\s+/, "");
  } else { // The user has a block of text selected, work only on the selected bit
    el.value = el.value.substring(0, el.selectionStart) + callback(el.value.substring(el.selectionStart, el.selectionEnd), true) + el.value.substring(el.selectionEnd);
  }
  if(actOnTitle) {
    document.getElementById('title').value = callback(document.getElementById('title').value);
  }
  change();
  switchToDiff();
}

var buttons = [];

/*
  Constructs a button in the toolbar.
  Pass an object with the following keys:
    - name: what's displayed in the toolbar
    - title: tooltip [optional]
    - id: id of the element (will have -button apended) [optional]
    - pos: right offset of the button
    - callback: a function to invoke when the button is clicked
*/
function add_button(obj) {
  obj.id = (obj.id == undefined ? obj.name.toLowerCase() : obj.id);
  obj.title = (obj.title == undefined ? obj.name : obj.title);
  buttons.push(obj);
}

window.addEventListener('load', function() {
  var d = document.createElement('div');
  
  
  buttons.forEach(function(b) {
    d.innerHTML = '<li class="wmd-button" id="'+b.id+'-button" title="'+b.title+'" style="background-position: 15px -200px; right: '+b.pos.toString()+'px; top: 3px"><a href="#">'+b.name+'</a></li>';
    document.querySelector('#wmd-button-row').appendChild(d.children[0]);
    document.getElementById(b.id + '-button').addEventListener('click', b.callback, false);
  });
  
}, false);