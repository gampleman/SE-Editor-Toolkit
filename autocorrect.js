/*
  This function does all the changes to the code in a series of replace steps.
*/
function correct(line) {
  // words to capitalize
  var words = ["AMD", "AppleScript", "ASUS", "ATI", "Bluetooth", "DivX", "DVD", "Eee PC", "FireWire",
   "GarageBand", "GHz", "iBookstore", "iCal", "iChat", "iLife", "iMac", "iMovie", "iOS", "iPad",
   "iPhone", "iPhoto", "iPod", "iTunes", "iWeb", "iWork", "JavaScript", "jQuery", "Lenovo",
   "MacBook", "MacPorts", "MHz", "MobileMe", "MySQL", "Nvidia", "OS X", "PowerBook", "PowerPoint",
   "QuickTime", "SSD", "TextEdit", "TextMate", "ThinkPad", "USB", "VMware", "WebKit", "Wi-Fi",
   "Windows XP", "WordPress", "Xcode", "XMLHttpRequest", "Xserve"];
  return line
  // convert pronouns from monkeglish/lolcatz
  .replace(/( |^)i( |')/g, "$1I$2")
  .replace(/( |^)i ?m /ig, "$1I'm ")
  .replace(/( |^)u /g, "$1you ")
  .replace(/( |^)ur /g, "$1your " )
  .replace(/\bcud\b/ig, "could")
  .replace(/\bb4\b/ig, "before")
  // these ' are a fricking effort to type, eh?
  .replace(/ (can|doesn|won|hasn|isn)t /ig, " $1't ")
  // determiners are often a problem (might need to handle the few exceptional cases)
  .replace(/\b(a)n(?= +[^aeiou])/gi, "$1")
  .replace(/\b(a)(?= +[aeiou])/gi, "$1n")
  .replace(/\b(a)lot\b/gi, "$1 lot")
  // get rid of greetings and gratitude (would be nice to get rid of signature as well
  //  but I have no clue how)
  // as per  http://meta.stackoverflow.com/questions/2950
  .replace(/^(H(i|[iy][ea]|ell?o)|greet(ings|z)( to)?) ?(every(one|body)|expert|geek|all|friend|there|guy|people|folk)?s? *[\!\.\,\:]* */ig, "")
  .replace(/^(thx|thanks?|cheers|thanx|tia) ?((in advance)|you)?[\.\!\,]*/gi, "")
  //.replace(/ple?a?se?( he?lp)?[\.\!]*/ig, "")
  .replace(/( |^)pl[sz] /i, " please ")
  // basic typography
  .replace(/ *([\:\,]) */g, "$1 ")
  // uses a negative lookahead to skip common filenames (that can't be begenings of words)
  .replace(/([\.\?\!] *|^)(?!rb|txt|hs|x?h?t?ml|htaccess|dll|wav|mp3)(.)(?![\s\.])/g, function() {
    if(arguments[1].length == 0) {
      return arguments[2].toUpperCase();
    } else {
      return  arguments[1].trim() + " " + arguments[2].toUpperCase();
    }
  })
  .replace(/ *\.( ?\.)+ */g, "... ")
  .replace(/ *([\?\!] ?)+ */g, "$1")
  //correct stuff messed up by this script
  .replace(/\. (\d)/g, ".$1") // digits tend to be version numbers or numerals
  // use of comma is the most common, see http://english.stackexchange.com/questions/16172
  .replace(/\be\.? *G\.?\,? +(.)/gi, function() { return "e.g., " + arguments[1].toLowerCase()})
  //too bad it's also short for Internet Explorer (it can screw up your js just by it's mere existence)
  .replace(/\bi\. *e\. (.)/gi, function() { return "i.e. " + arguments[1].toLowerCase()})
  // Use the words defined at the top
  .replace(RegExp('\\b(?:(' + words.join(')|(') + '))\\b', 'ig'), function(m) {
    for(var a = arguments.length - 2; a--;) {
      if(arguments[a]) {
        return words[a-1] || m;
      }
    }
  });
}

add_button({ // defined in toolbar.js
  name: 'Autocorrect',
  pos: 80,
  callback: function() {
    actOnSelection(function(txt, isSelection) {
      return clean(txt.replace(/\t/g, "    "), correct); 
    }, true);
  }
});