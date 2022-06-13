const { Lexer } = require('./src');

const lexer = new Lexer('say "This"');

console.log(lexer.start());
