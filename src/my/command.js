class Command {
    // A class that can be used to initiate objects for commands

    constructor(obj) {
        if (typeof obj != 'object') {
            console.warn('Not given an object');
            return;
        }

        this.type = 'command';
        this.scope = 'global';
        this.command = '';
        this.group = undefined;
        this.title = undefined;
        this.show = true;
        this.keybinding = undefined;
        this.enabled = true;
        this.icon = undefined;
        this.method = undefined;
        this.args = undefined;

        for (const key in obj) {
            if (key in this) {
                this[key] = obj[key];
            } else {
                console.warn(`Key "${key}" is not a valid key for Command`);
            }
        }
    }

    get fullname() {
        if (this.group) {
            return `${this.group}: ${this.title}`;
        }
        return this.title;
    }
}

export default Command;