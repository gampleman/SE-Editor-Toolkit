SE Editing Toolkit
==================

Adds a couple of features for easier editing of (mainly crappy) questions on the SE sites. See http://stackapps.com/questions/2209/se-editor-toolkit for the Stackapps thread.

Contributing
------------

The code is written in [CoffeeScript](http://jashkenas.github.com/coffee-script/). Compile it with:

    $ cake build
    
Other commands available are:

    $ cake
    cake build                # Compile the CoffeeScript source.
    cake build:safari         # Compile and reload the Safari Extension
    cake build:userscript     # Compile and transform into UserScript version
    cake deploy:safari        # Save the Safari Extension bundle
    
    
If you've never written CoffeeScript don't worry, it's very similar to JavaScript but has a few Ruby and Python influences to it.

The code should be very readable where `toolbar.coffee` is the file containing some common logic and then each button has it's own file. `diff.coffee` (surprisingly enough) contains the diffing functionality.

Procedure is simple, fork, edit, send pull request. The plugin should be easy to port to any other browser, it is built with very basic js (it uses `querySelector` in a few cases, but this is not necessary and can be easily removed). I'm happy to maintain other versions for other browsers as long as you provide a build script to automatically build the extension from these source files.

For example don't be shy to submit a patch to add some proper icons, I'm pretty sure that the current unicode chars are pretty confusing.

Features
========

There's been an onslaught of rather difficult to read questions on SO lately. A lot of them are just plain close-fodder, but many are just from d ppl ,who spk da internetz lingo and hence <strike>make my eyes bleed</strike> are pretty much incomprehensible  without extensive parsing/editing. They also somehow do not manage to grasp basic markdown. Now manually editing all these answers can often be a massive pain, so I wrote this browser extension.

![Screenshot][1]

It adds a few more buttons to the SE `edit` pages (so no distractions when just posting) that aid in making these sites awesome.

Autocorrect
-----------

This is the main tool of the suite. It is in fact a huge collection of regexps that correct the most common mistakes people commonly make on SO. These include (see [the source][2] for full details):

- correcting capitalization (`how do i do this. help.` => `How do I do this. Help.`)
- correcting use of apostrophes (`im cant hasnt` => `I'm can't hasn't`)
- correcting basic punctuation (`what ? how.does......this` => `What? How. Does... This`)
- deleting [unnecessary greetings or signs of gratitude][3]

Note: These are Regexps, not any smart NLP so check the post so that you don't screw anything up. For that we provide:

Realtime diff
-------------

There's a hand link provided that toggles between the realtime preview and a realtime diff of your changes and the original version. All of the automated functions also automatically display the diff after execution.

Lowercasing
-----------

Sometimes people JUST CAN'T HELP SHOUTING! There's a handy button that converts selected text to lowercase, or finds sequences of shouting and lowercases them automatically.

Search & Replace
----------------

Sometimes a simple regexp can fix a lot of problems instantaneously. Click on the search button and get the Search & Replace interface:

![Screenshot of Search & Replace][4]

JS regexp support. Did I mention insta-diffing?


Code-sane<sup>tm</sup>
---------------------

Sometimes people Copy-paste their code and it gets all messy. This replaces tabs with four spaces and realigns all code to the four space offset, making reformatting it a breeze.

Where can I get it?
-----------

- [Download the Safari Extension][5].
- Or [get the source][6].

Gotchas
-------

- Autocorrect and Lowercase ignore code so be sure to mark stuff as code before you apply them.
- Autocorrect also applies to the title of the post, be sure to check that as well.
- Filenames sometimes get autocorrected. Mark them as code or correct them back (some common extensions are checked for, but this is by no means comprehensive. If the post is full of filenames, consider not using Autocorrect).


  [1]: http://i.imgur.com/4k5f4.png
  [2]: https://github.com/gampleman/SE-Editor-Toolkit/blob/master/autocorrect.js
  [3]: http://meta.stackoverflow.com/questions/2950
  [4]: http://i.imgur.com/tKf1k.png
  [5]: https://github.com/downloads/gampleman/SE-Editor-Toolkit/safari-v1.safariextz
  [6]: https://github.com/gampleman/SE-Editor-Toolkit