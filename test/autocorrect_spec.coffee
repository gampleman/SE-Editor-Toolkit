buttons = {}
input = ""
# Fake object
global.Toolbar = 
  add_button: (obj) -> buttons[obj.name] = obj
  clean: (txt, callback) -> txt.split("\n").map(callback).join("\n").trim()
  actOnSelection: (callback, _) -> callback input, false

describe 'autocorrect', ->
  # setup test text
  require('./build/autocorrect.js')
  autocorrect = buttons['Autocorrect']
  
  it 'should capitalize stuff', ->
    input  = "my wordpress doesn't work. help me. i want my jquery too."
    output = "My WordPress doesn't work. Help me. I want my jQuery too."
    expect(autocorrect.callback()).toEqual output
    
  it 'should add single quotes where appropriate', ->
    input  = "I cant do this - it hasnt worked for ages"
    output = "I can't do this - it hasn't worked for ages"
    expect(autocorrect.callback()).toEqual output
    
  it 'should correct determiners', ->
    input  = "A user gave me a ickle. An master should teach a student alot. An HTML like an eal."
    output = "A user gave me an ickle. A master should teach a student a lot. An HTML like an eal."
    expect(autocorrect.callback()).toEqual output
    
  it 'should correct mis-abbreviations', ->
    input  = 'Pls cud u help me b4 midnight.'
    output = 'Please could you help me before midnight.'
    expect(autocorrect.callback()).toEqual output

  it 'should correct punctuation and spacing', ->
    input  = 'What ? I thought it was in suicide.txt .. ..I am angry!And mad!!'
    output = 'What? I thought it was in suicide.txt... I am angry! And mad!'
    expect(autocorrect.callback()).toEqual output
    
  it 'should strip away greetings & gratitude', ->
    input  = '''
    hi all,
    This is my problem.
    Thanks in advance
    '''
    output = 'This is my problem.'
    expect(autocorrect.callback()).toEqual output
    
  