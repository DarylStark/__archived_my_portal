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
            let keybinding_string = command_object.keybinding.get_string();
            if (this.command_keybindings.has(keybinding_string)) {
                let existing_object = this.command_keybindings.get(keybinding_string);
                console.warn(`While registering keybinding for "${command_object.command}" - Keybinding "${keybinding_string}" already exists for command "${existing_object}"`);
            }
            this.command_keybindings.set(command_object.keybinding.get_string(), command_object.command);
        }
    }

    remove_command_scope(scope) {
        // Remove commands with a specific scope
        let commands = new Array();
        this.commands.forEach((cmd) => {
            if (cmd.scope === scope)
                commands.push(cmd);
        });

        this.remove_command(commands);
    }

    remove_command(cmdlist) {
        let to_remove = cmdlist;
        if (!Array.isArray(to_remove))
            to_remove = [cmdlist];

        // Remove from the 'methods' list and from the 'keybindings' list and
        // create a array with the commands
        let to_remove_cmdlist = new Array();
        to_remove.forEach((cmd) => {
            // Remove from the 'methods' list
            if (this.command_methods.has(cmd.command) != -1) {
                this.command_methods.delete(cmd.command);
            }

            // Remove from the 'keybindings' list
            if (cmd.keybinding) {
                if (this.command_keybindings.has(cmd.keybinding.get_string())) {
                    this.command_keybindings.delete(cmd.keybinding.get_string());
                }
            }

            // Add to the array to remove it from the normal list
            to_remove_cmdlist.push(cmd.command)
        });

        // Remove commands from the command list
        this.commands = this.commands.filter((cmd) => {
            return to_remove_cmdlist.indexOf(cmd.command) === -1;
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