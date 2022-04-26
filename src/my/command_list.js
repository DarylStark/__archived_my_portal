class CommandList {
    constructor() {
        this.commands = [];
        this.command_methods = new Map();

        // TODO: read the tags from the database
        this.tags = [
            {
                fullname: 'My first tag',
                type: 'tag',
                command: 'my-first-tag',
                show: true
            },
            {
                fullname: 'My second tag',
                type: 'tag',
                command: 'my-second-tag',
                show: false
            }
        ];

        // Create the map with possible prefixes
        this.search_prefixes = new Map([
            ['#', 'tags']
        ]);
    }

    add_command(scope, group, command, title, method, args = undefined, show = true) {
        // Add the command to the list
        this.commands.push({
            type: 'command',
            scope: scope,
            group: group,
            command: command,
            title: title,
            fullname: group + ': ' + title,
            show: show
        });

        // Add the method to the map
        this.command_methods.set(command, [method, args]);
    }

    sort_method(first, second) {
        if (first.fullname.toLowerCase() > second.fullname.toLowerCase()) {
            return 1;
        }
        return -1;
    }

    get_list(filter) {
        // Default list is the command list
        let lst = this.commands;

        // Check if a prefix is given
        let list = '';
        let prefix = this.search_prefixes.get(filter[0]);
        if (prefix) {
            list = prefix;
            filter = filter.substring(1);
        }

        if (list == 'tags') {
            lst = this.tags.filter(function (item) {
                return item.show;
            });
        }

        // Empty filter; return the complete list
        if (filter == '') {
            return lst.sort(this.sort_method).filter(function (item) {
                return item.show;
            });
        }

        // Returns the command list filtered on text
        filter = filter.toLowerCase();
        let filtered_list
        return lst.filter(function (cmd) {
            if (!cmd.show) { return false; }
            let fullname = cmd.fullname.toLowerCase();
            return fullname.includes(filter);
        }).sort(this.sort_method);
    }

    execute(type, command) {
        if (type == 'command') {
            // Execute the command
            let cmd = this.command_methods.get(command);
            if (cmd) {
                if (typeof cmd[1] === 'object' && cmd[1] !== null) {
                    cmd[0](...cmd[1]);
                    return;
                }
                cmd[0](cmd[1]);
            }
        }
    }
};

export default new CommandList;