const { TOKEN_TYPES } = require('./constants');

class Interpreter {
    constructor(tokens, client, message) {
        this.tokens = tokens;
        this.client = client;
        this.message = message;

        this.curTok = null;
        this.idx = -1;

        this.next();
    }

    next() {
        this.idx++;

        this.curTok = this.idx < this.tokens.length
            ? this.tokens[this.idx]
            : null;
    }

    reverse() {
        this.idx--;

        this.curTok = this.idx < this.tokens.length
            ? this.tokens[this.idx]
            : null;
    }

    async start() {
        while (this.curTok != null && this.curTok.type !== TOKEN_TYPES.EOF) {
            if (this.curTok.compare(TOKEN_TYPES.KEYWORD, 'send')) {
                await this.say();
                this.next();
            }
        }
    }

    async say() {
        this.next();

        if (this.curTok.type !== 'STRING') {
            return {
                error: true,
                atToken: {
                    type: this.curTok.type,
                    value: this.curTok.value,
                },
                idx: this.idx,
            };
        }
        const content = this.curTok.value;
        this.next();

        let shouldReply = false;

        if (
            this.curTok.type === TOKEN_TYPES.NUM &&
            this.curTok.value >= 1
        ) shouldReply = true;
        else this.reverse();

        if (shouldReply) {
            await this.message.reply({
                content,
            });
        }
        else {
            await this.message.channel.send({
                content,
            });
        }
    }
}

module.exports = Interpreter;
