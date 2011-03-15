var current_re;
var last_start;
function doSearch () {
  recreateRegexp();
  findNext();
}

function recreateRegexp() {
  current_re = RegExp(document.getElementById('search-find').value, modifiers(true));
}

function findNext() {
  var res = current_re.exec(document.getElementById('wmd-input').value);
  last_start = current_re.lastIndex - res[0].length;
  document.getElementById('wmd-input').setSelectionRange(last_start, current_re.lastIndex);
}

function modifiers() {
  base = "m";
  if(!document.getElementById('search-casesensitive').checked) {
    base += "i";
  }
  if(arguments[0]) {
    base += "g";
  }
  return base;
}

function setupSearchUI () {
  var d = document.createElement('div');

  d.innerHTML = '<ul id="snr-ui" style="margin: 0; padding: 0"><li class="wmd-button" style="width: 100%; background-image: none"><form id="snr-form" action="#"><input type=text id="search-find" placeholder="Search (regexp)" /><input type=text id="search-replace" placeholder="Replace" /><button id="search-next">Next</button><button id="search-rnf">Replace &amp; Find</button><button id="search-replaceall">Replace all</button><input type=checkbox value=1 id="search-casesensitive" /><label for="search-casesensitive">Case sensitive</label></li></ul>';
  document.querySelector('#wmd-button-bar').appendChild(d.children[0]);
  document.querySelector('#wmd-button-bar').style.height = "50px";
  
  document.getElementById('search-find').addEventListener('change', recreateRegexp, false);
  document.getElementById('search-casesensitive').addEventListener('change', recreateRegexp, false);
  
  
  document.getElementById('snr-form').addEventListener('submit', function(ev) { 
    ev.preventDefault(); 
    doSearch();
    return false;
  }, false);
  document.getElementById('search-next').addEventListener('click', function(ev) {
    ev.preventDefault();
    if(current_re == undefined) {
      doSearch();
    } else {
      findNext();
    }
  });
  document.getElementById('search-rnf').addEventListener('click', function(ev) {
    ev.preventDefault();
    var el = document.getElementById('wmd-input');
    if(current_re == undefined || el.selectionStart == el.selectionEnd) {
      doSearch();
    }
    var re = RegExp(document.getElementById('search-find').value, modifiers);
    el.value = el.value.substring(0, el.selectionStart) + el.value.substring(el.selectionStart, el.selectionEnd).replace(re, document.getElementById('search-replace').value) + el.value.substring(el.selectionEnd);
    findNext();
  });
  document.getElementById('search-replaceall').addEventListener('click', function(ev) {
    ev.preventDefault();
    var el = document.getElementById('wmd-input');
    el.value = el.value.replace(current_re, document.getElementById('search-replace').value);
    change();
    switchToDiff();
  });
}

add_button({
  title: "Search &amp; Replace",
  id: 'snr',
  name: '&#128269;',
  pos: 140,
  callback: function() {
    if(document.getElementById('snr-ui') == null) {
      setupSearchUI();
    } else {
      if(document.getElementById('snr-ui').style.display == 'block') {
        document.getElementById('snr-ui').style.display = 'none';
        document.querySelector('#wmd-button-bar').style.height = "25px";
      } else {
        document.getElementById('snr-ui').style.display = 'block';
        document.querySelector('#wmd-button-bar').style.height = "50px";
      }
    }
  }
});
