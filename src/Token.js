class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }

    compare(type, value) {
        return this.type === type && this.value === value;
    }
}

module.exports = Token;
