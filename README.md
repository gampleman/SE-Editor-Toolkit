SE Editing Toolkit
==================

Adds a couple of features for easier editing of (mainly crappy) questions on the SE sites. 

Contributing
------------

The code should be reasonably readable where `toolbar.js` is the file containing some common logic and then each button has it's own file. `jsdiff.js` (suprisingly enough) contains the diffing functionality.

Procedure is simple, fork, edit, send pull request. The plugin should be easy to port to any other browser, it is built with very basic js (it uses `querySelector` in a few cases, but this is not necessary and can be easily removed). I'm happy to maintain other versions for other browsers as long as you provide a build script to automatically build the extension from these sourcefiles.