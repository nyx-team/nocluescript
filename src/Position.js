class Position {
    constructor(charPos, linePos, colPos) {
        this.charPos = charPos;
        this.linePos = linePos;
        this.colPos = colPos;
    }

    next(curChar) {
        this.charPos++;
        this.colPos++;

        if (curChar === '\n') {
            this.colPos = 0;
            this.linePos++;
        }
    }
}

module.exports = Position;
