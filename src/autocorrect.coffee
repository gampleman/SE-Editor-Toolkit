#  This function does all the changes to the code in a series of replace steps.
Toolbar.add_button
  name: 'Autocorrect'
  pos:  80
  callback: ->
    Toolbar.actOnSelection (txt, isSelection) ->
      Toolbar.clean txt.replace(/\t/g, "    "), (line) ->
        # words to capitalize
        words = ["AMD", "AppleScript", "ASUS", "ATI", "Bluetooth", "DivX", "DVD", "Eee PC", "FireWire",
         "GarageBand", "GHz", "iBookstore", "iCal", "iChat", "iLife", "iMac", "iMovie", "iOS", "iPad",
         "iPhone", "iPhoto", "iPod", "iTunes", "iWeb", "iWork", "JavaScript", "jQuery", "Lenovo",
         "MacBook", "MacPorts", "MHz", "MobileMe", "MySQL", "Nvidia", "OS X", "PowerBook", "PowerPoint",
         "QuickTime", "SSD", "TextEdit", "TextMate", "ThinkPad", "USB", "VMware", "WebKit", "Wi-Fi",
         "Windows XP", "WordPress", "Xcode", "XMLHttpRequest", "Xserve"]
        line
        # convert pronouns from monkeglish/lolcatz
        .replace(/( |^)i( |')/g,          "$1I$2"  )
        .replace(/( |^)i ?m /ig,          "$1I'm " )
        .replace(/( |^)u /g,              "$1you " )
        .replace(/( |^)ur /g,             "$1your ")
        .replace(/\bcud\b/ig,             "could"  )
        .replace(/\bb4\b/ig,              "before" )
        # these '' are a fricking effort to type, eh?
        .replace(/\b(can|doesn|won|hasn|isn|didn)t\b/ig, "$1't")
        # determiners are often a problem, special cased HTML.
        .replace(/\b(a)n(?= +(?![aeiou]|HTML|user))/gi,"$1")
        .replace(/\b(a)(?= +[aeiou])/gi,  "$1n"     )
        .replace(/\b(a)lot\b/gi,          "$1 lot"  )
        # get rid of greetings and gratitude (would be nice to get rid of signature as well
        #  but I have no clue how)
        # as per  http://meta.stackoverflow.com/questions/2950
        .replace(/// ^( H(i|[eaiy][yiea]|ell?o) |  greet(ings|z) ) # hi hello greetings
          (\s  to  )? \s?                                      # to
          ( every(one|body) | expert | geek | all | friend | there | guy | people | folk )?s?
          \s*[\!\.\,\:]*\s*///ig, "")
        .replace(/^(thx|thanks?|cheers|thanx|tia)\s?((in advance)|you)?[\.\!\,]*/gi, "")
        #.replace(/ple?a?se?( he?lp)?[\.\!]*/ig, "")
        .replace(/( |^)pl[sz] /i,         " please ")
        # basic typography
        .replace(/[ ]*([\:\,]) */g,        "$1 ")
        # uses a negative lookahead to skip common filenames (that can't be beginnings of words)
        .replace(/([\.\?\!] *|^)(?!rb|txt|hs|x?h?t?ml|htaccess|dll|wav|mp3|exe|ini|htpasswd)(.)(?![\s\.])/g, ->
          if arguments[1].length == 0
            arguments[2].toUpperCase();
          else 
            arguments[1].trim() + " " + arguments[2].toUpperCase();
        ).replace(/[ ]*\.( ?\.)+ */g,      "... " )
        .replace(/[ ]*([\?\!] ?)+ */g,     "$1"   )
        #correct stuff messed up by this script
        .replace(/\. (\d)/g,              ".$1") # digits tend to be version numbers or numerals
        # use of comma is the most common, see http://english.stackexchange.com/questions/16172
        .replace(/\be\.? *G\.?\,? +(.)/gi, (_, l) -> "e.g., " + l.toLowerCase()
        #too bad it's also short for Internet Explorer (it can screw up your js just by it's mere existence)
        ).replace(/\bi\. *e\. (.)/gi, (_, l) -> "i.e. " + l.toLowerCase()
        # Use the words defined at the top
        ).replace RegExp('\\b(?:(' + words.join(')|(') + '))\\b', 'ig'), (m) ->
          a = arguments.length - 2
          while a--
            return words[a-1] || m if arguments[a]
            
    , true # = Will do stuff on the title as well
  