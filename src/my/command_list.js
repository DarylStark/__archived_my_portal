import Command from './command';
import store from '../dashboard-store';
import router from '../dashboard-router';

class CommandList {
    // Class for the list of commands

    constructor() {
        this.commands = [];
        this.command_methods = new Map();
        this.command_keybindings = new Map();
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

    remove_command_scope(scope) {
        // Remove commands with a specific scope
        this.commands = this.commands.filter((cmd) => {
            return cmd.scope != scope;
        });
    }

    remove_command(command) {
        // Remove commands with a specific scope
        this.commands = this.commands.filter((cmd) => {
            return cmd.command != command;
        });
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

    execute(command) {
        // Method to execute a command
        let cmd = this.command_methods.get(command);
        if (cmd) {
            if (typeof cmd[1] === 'object' && cmd[1] !== null) {
                cmd[0](...cmd[1]);
                return;
            }
            cmd[0](cmd[1]);
        }
    }

    execute_from_keybinding(keybinding) {
        // Method that runs a command from a keybinding. Returns true if the
        // binding is found, false if it isn't
        let keybinding_string = keybinding.get_string();
        let cmd = this.command_keybindings.get(keybinding_string);
        if (cmd) {
            this.execute(cmd);
            return true;
        }
        return false;
    }
};

export default new CommandList;