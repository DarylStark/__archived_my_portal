class CommandList {
    constructor() {
        this.list = [];
    }

    add_command(scope, group, command, title, method) {
        // Add the command
        this.list.push({
            scope: scope,
            group: group,
            command: command,
            title: title,
            method: method
        });
    }

    sort() {
        console.log('sorting');
        this.list.sort((a, b) => {
            let full_command_a = a.group + ': ' + a.title;
            let full_command_b = b.group + ': ' + b.title;
            if (full_command_a > full_command_b) {
                return 1;
            }
            return -1;
        })
    }
};

export default new CommandList;