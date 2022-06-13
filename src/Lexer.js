const {
    KEYWORDS,
    TOKEN_TYPES,
    IGNORED_CHARS,
} = require('./constants');
const Position = require('./Position');
const Token = require('./Token');

class Lexer {
    /**
     * @param {string} text
     */
    constructor(text) {
        this.text = text;

        this.pos = new Position(-1, 0, -1);
        this.char = null;
        this.tokens = [];
        
        this.next();
    }

    next() {
        this.pos.next(this.char);
        this.char = this.pos.charPos < this.text.length
            ? this.text[this.pos.charPos]
            : null;
    }

    start() {
        while (this.char != null) {
            if (/(\t|\s|\n)/.test(this.char)) {
                this.next();
            }
            else if (this.char === '"') {
                this.tokens.push(this.getString());
            }
            else if (/^[A-Za-z]+$/.test(this.char)) {
                this.tokens.push(this.getId());
            }
            else {
                const char = this.char;
                this.next();

                return {
                    error: true,
                    message: `Invalid Char: ${char}`,
                    atCol: this.pos.colPos,
                    atLine: this.pos.linePos,
                };
            }
        }

        this.tokens.push(new Token(
            TOKEN_TYPES.EOF
        ));
        return this.tokens;
    }

    getId() {
        let ID = '';

        while (
            this.char != null &&
            /^[A-Za-z]+$/.test(this.char)
        ) {
            ID += this.char;
            this.next();
        }

        const tokenType = KEYWORDS.includes(ID)
            ? TOKEN_TYPES.KEYWORD
            : TOKEN_TYPES.IDENTIFIER;

        return new Token(tokenType, ID);
    }

    getString() {
        let stringRes = '';

        // Advance here to not get stuck to char `"`
        // and instantly break the loop
        this.next();

        while (
            this.char != null &&
            this.char !== '"'
        ) {
            stringRes += this.char;
            this.next();
        }

        // Go to the next character so it doesn't get stuck
        // with `"` and loop forever
        this.next();

        return new Token(TOKEN_TYPES.STRING, stringRes);
    }
}

module.exports = Lexer;
