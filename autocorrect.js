/*
  This function does all the changes to the code in a serries of replace steps.
*/
function correct(line) {
  return line
  // convert pronouns from monkeglish/lolcatz
  .replace(/( |^)i( |')/g, "$1I$2")
  .replace(/( |^)i ?m /ig, "$1I'm ")
  .replace(/( |^)u /g, "$1you ")
  .replace(/( |^)ur /g, "$1your " )
  .replace(/ cud /g, " could ")
  // these ' are a fricking effort to type, eh?
  .replace(/ (can|doesn|won|hasn|isn)t /ig, " $1't ")
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
  .replace(/([\.\?\!] *|^)(?!rb|txt|hs|x?h?t?ml|htaccess)(.)(?![\s\.])/g, function() {
    if(arguments[1].length == 0) {
      return arguments[2].toUpperCase();
    } else {
      return  arguments[1].trim() + " " + arguments[2].toUpperCase();
    }
  })
  //.replace(/\. ?\. ?/g, ".")
  .replace(/ *\.( ?\.)+ */g, "... ")
  .replace(/ *([\?\!] ?)+ */g, "$1")
  // product name capitalization (people always get this wrong)
  .replace(/jquery/ig, "jQuery")
  .replace(/mysql/ig, "MySQL")
  //correct stuff messed up by this script
  .replace(/\. (\d)/g, ".$1") // digits tend to be version numbers or numerals
  // use of comma is the most common, see http://english.stackexchange.com/questions/16172
  .replace(/e\. *G\.\,? (.)/gi, function() { return "e.g., " + arguments[1].toLowerCase()})
  .replace(/i\. *e\. (.)/gi, function() { return "i.e. " + arguments[1].toLowerCase()});
}

add_button({
  name: 'Autocorrect',
  pos: 80,
  callback: function() {
    actOnSelection(function(txt, isSelection) { return clean(txt.replace(/\t/g, "    "), correct); }, true);
  }
});
