class CommandList {
    // Class for the list of commands

    constructor() {
        this.commands = [];
        this.command_methods = new Map();
        this.command_keybindings = new Map();

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

    add_command(scope, group, command, title, method, args = undefined, show = true, keybinding = undefined, enabled = true) {
        // Add the command to the list
        this.commands.push({
            type: 'command',
            scope: scope,
            group: group,
            command: command,
            title: title,
            fullname: group + ': ' + title,
            show: show,
            keybinding: keybinding,
            enabled: enabled
        });

        // Add the method to the map
        this.command_methods.set(command, [method, args]);

        // Add the keybinding to the map
        if (keybinding) {
            this.command_keybindings.set(keybinding.get_string(), command);
        }
    }

    sort_method(first, second) {
        if (first.fullname.toLowerCase() > second.fullname.toLowerCase()) {
            return 1;
        }
        return -1;
    }

    set_visibility_command(commands, visibility) {
        // Method to set the visibility of a specific command
        let cmd = this.commands.filter((c) => {
            return commands.includes(c.command);
        });

        cmd.forEach((c) => {
            c.show = visibility;
        });
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
        // Method to execute a command

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

    execute_from_keybinding(keybinding) {
        // Method that runs a command from a keybinding. Returns true if the
        // binding is found, false if it isn't
        let keybinding_string = keybinding.get_string();
        let cmd = this.command_keybindings.get(keybinding_string);
        if (cmd) {
            this.execute('command', cmd);
            return true;
        }
        return false;
    }
};

export default new CommandList;