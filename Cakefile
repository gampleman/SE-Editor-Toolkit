{exec} = require 'child_process'
fs     = require 'fs'

# Function to not brake the string 
strip_special = (contents) -> contents.replace(///\\ ///g, '\\\\').replace(/\n/g, '\\n').replace(/"/g, '\\"')

task 'test', 'Run the Specs', (options) ->
  # Compile Coffee to js due to a bug in jasmine-node
  exec 'coffee -b --output spec/build --compile src/*.coffee', ->
    exec 'coffee -b --output spec --compile test/*.coffee ', (error) ->
      if error then throw error else exec 'jasmine-node', (err, stdout, stderr) ->
        console.log stdout, stderr
        #if err then throw err else console.log stdout #unless err
        exec 'rm -r spec'
        
task 'docs', 'Build the annotated source code in the gh-pages branch', (options) ->    
  exec 'docco src/* && rm -r ../docs && mv docs ../docs && git checkout gh-pages && mv ../docs docs && git add docs/* && git commit -m "Added updated docs." && git checkout master', (err) -> if err then throw err

task 'build', 'Compile the CoffeeScript source.', (options) ->
  exec 'coffee --join -b --compile src/toolbar.coffee src/diff.coffee src/autocorrect.coffee src/code_sane.coffee src/search.coffee src/togglecase.coffee', (err) -> 
    if err then throw err else
      exec 'cat src/resig_diff.js >> concatenation.js'
      console.log "Code build succesful."

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
  
  js += strip_special fs.readFileSync('concatenation.js', 'utf8').replace("window.addEventListener('load',", 'RegisterLoadFunction(')
  
  # Call the load functions and append to the dom
  js += "\\nfor(var i=0;i<load_functions.length;++i)\\n  load_functions[i]();\";
  document.getElementsByTagName('head')[0].appendChild(exec_script);"
    
  fs.writeFile 'output.user.js', js
  
option '-o', '--build_name [NAME]', 'What to name the code'
option '-v', '--version [VERSION]', 'Publish as version'
option '-V', '--deversion [V]', 'Version number'
task 'deploy:safari', 'Save the Safari Extension bundle', (options) ->
  throw "ArgumentError" unless options.version
  invoke 'build'
  file_name = "#{options.build_name || "latest"}.safariextz"
  exec """osascript -e '
   tell application "System Events"
   	tell process "Safari"
   	  --set value of text field 1 of group 22 of UI element 1 of scroll area 1 of window "Extension Builder"  to "#{options.version}"
      --set num to (value of text field 1 of group 24 of UI element 1 of scroll area 1 of window "Extension Builder") + 1
      --set value of text field 1 of group 24 of UI element 1 of scroll area 1 of window "Extension Builder" to num as string
      --click button "Reload"  of UI element "ReloadUninstallSE Editor Toolkit"  of UI element 1 of scroll area 1 of window "Extension Builder"
   		click button "Build Package…" of group 4 of UI element 1 of scroll area 1 of window "Extension Builder"
   		delay 1
   		set value of text field 1 of sheet 1 of window "Extension Builder" to "#{file_name}"
   		click button "Save" of sheet 1 of window "Extension Builder"
   		--click button "Replace"  of sheet 1 of sheet 1 of window "Extension Builder"

   	end tell
   end tell'
  """, (err) -> if err 
    throw err 
  else 
    exec 'git checkout gh-pages', (err) -> if err then throw err else
      fs.renameSync "../#{file_name}", "./#{file_name}"
      updates = fs.readFileSync('./updates.plist', 'utf8').replace(///
      <key>CFBundleVersion</key>\n
      \s*<string>\d+</string>\n
      \s*<key>CFBundleShortVersionString</key>\n
      \s*<string>[\d\.]+</string>
      ///,
      """
      <key>CFBundleVersion</key>
           <string>#{options.deversion.trim()}</string>
           <key>CFBundleShortVersionString</key>
           <string>#{options.version}</string>
      """)
      fs.writeFileSync './updates.plist', updates, 'utf8'
    
      exec "git add #{file_name} updates.plist && git commit -m 'Released version #{options.version}' && git checkout master", (err) -> if err then throw err


task 'deploy', "Prepares the safari extension, user script & docs", (options) ->
  invoke 'deploy:safari'
  invoke 'docs'
  invoke 'build:userscript'
  exec "mv output.user.js ../output.user.js && git checkout gh-pages && mv ../output.user.js output.user.js && git add output.user.js && git commit -m 'Released version #{options.version}' && git checkout master && git tag #{options.version} && git push origin master --tags && git push origin gh-pages", (err) -> if err then throw err
