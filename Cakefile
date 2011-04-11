{exec} = require 'child_process'
fs     = require 'fs'

# Function to not brake the string 
strip_special = (contents) -> contents.replace(///\\ ///g, '\\\\').replace(/\n/g, '\\n').replace(/"/g, '\\"')

task 'build', 'Compile the CoffeeScript source.', (options) ->
  exec 'coffee --join -b --compile src/toolbar.coffee src/diff.coffee src/autocorrect.coffee src/code_sane.coffee src/search.coffee src/togglecase.coffee', (err) -> throw err if err

task 'build:safari', 'Compile and reload the Safari Extension', (options) ->
  invoke 'build'
  exec """osascript -e '
   tell application "System Events"
   	tell process "Safari"
   		click button "Reload"  of UI element "ReloadUninstallSE Editor Toolkit"  of UI element 1 of scroll area 1 of window "Extension Builder"
   	end tell
   end tell '
  """
  
task 'build:userscript', 'Compile and transform into UserScript version', (options) ->
  invoke 'build'
  # Userscript prelude
  js = """
  // ==UserScript==
  // @name          SE Editor Toolkit
  // @author        Jakub Hampl (adapted by Nathan Osman)
  // @namespace     http://quickmediasolutions.com
  // @description      Provides enhanced editing tools to the post editor
  // @include       http://stackoverflow.com/posts/*/edit*
  // @include       http://meta.stackoverflow.com/posts/*/edit*
  // @include       http://superuser.com/posts/*/edit*
  // @include       http://serverfault.com/posts/*/edit*
  // @include       http://askubuntu.com/posts/*/edit*
  // @include       http://stackapps.com/posts/*/edit*
  // @include       http://*.stackexchange.com/posts/*/edit*
  // ==/UserScript==

  var exec_script = document.createElement('script');
  exec_script.type = 'text/javascript';
  exec_script.textContent = "var load_functions = new Array();\\nfunction RegisterLoadFunction(item, ignored) { load_functions.push(item); }\\n
  """
  # Add in the files we need
  for file in ["concatenation.js", "resig_diff.js"]
    # Strip off some stuff and replace the events
    js += strip_special fs.readFileSync('concatenation.js', 'utf8').replace("window.addEventListener('load',", 'RegisterLoadFunction(')
  
  # Call the load functions and append to the dom
  js += "\\nfor(var i=0;i<load_functions.length;++i)\\n  load_functions[i]();\";
  document.getElementsByTagName('head')[0].appendChild(exec_script);"
    
  fs.writeFile 'output.user.js', js
  
  
task 'deploy:safari', 'Save the Safari Extension bundle', (options) ->
  invoke 'build'
  exec """osascript -e '
   tell application "System Events"
   	tell process "Safari"
   		click button "Build Package…" of group 4 of UI element 1 of scroll area 1 of window "Extension Builder"
   		delay 1
   		set value of text field 1 of sheet 1 of window "Extension Builder" to "#{options.build_name || "latest"}.safariextz"
   		click button "Save" of sheet 1 of window "Extension Builder"
   	end tell
   end tell'
  """
  
