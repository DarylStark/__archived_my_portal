import Command from './command';

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
                show: true,
                icon: 'fa-hashtag'
            },
            {
                fullname: 'My second tag',
                type: 'tag',
                command: 'my-second-tag',
                show: false,
                icon: 'fa-hashtag'
            }
        ];

        // Create the map with possible prefixes
        this.search_prefixes = new Map([
            ['#', 'tags'],
            ['>', 'commands']
        ]);
    }

    add_command(command_object) {
        // Method to add commands to the list
        if (!(command_object instanceof Command)) {
            console.warn('Argument should be a Command-instance');
            return;
        }

        this.commands.push(command_object);

        // Add the method to the map
        this.command_methods.set(command_object.command, [command_object.method, command_object.args]);

        // Add the keybinding to the map
        if (command_object.keybinding) {
            this.command_keybindings.set(command_object.keybinding.get_string(), command_object.command);
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
        // Default list is empty. Can be set to anything
        let lst = [];

        // Check if a prefix is given
        let list = '';
        let prefix = this.search_prefixes.get(filter[0]);
        if (prefix) {
            list = prefix;
            filter = filter.substring(1);
        }

        if (list == 'commands') {
            lst = this.commands.filter(function (item) {
                return item.show;
            });
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