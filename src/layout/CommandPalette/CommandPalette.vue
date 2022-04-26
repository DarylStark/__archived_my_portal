<template>
    <div id="command_palette">
        <div id="input">
            <Input
                id="input"
                v-model="input"
                ref="input"
                v-on:keydown="keydown"
            ></Input>
        </div>
        <div id="commands" ref="commands">
            <Command
                v-for="(command, index) in commands"
                v-bind:key="command"
                v-bind:active="index == active_index"
                v-on:click="execute(index)"
            >
                {{ command.fullname }}
            </Command>
        </div>
    </div>
</template>

<script>
import Input from '../../components/Input.vue';
import Command from './Command.vue';
import cmdlist from '../../my/command_list';

export default {
    name: 'CommandPalette',
    components: { Input, Command },
    mounted() {
        this.$refs.input.focus();
    },
    data() {
        return {
            input: '',
            max_index: 0,
            active_index: -1,
        };
    },
    computed: {
        commands() {
            this.active_index = 0;
            let list = cmdlist.get_list(this.input);
            this.max_index = list.length;
            if (this.max_index == 0) this.active_index = -1;
            return list;
        },
    },
    methods: {
        increase_active_index(increase) {
            if (this.max_index >= 0) {
                this.active_index += increase;
                if (this.active_index < 0)
                    this.active_index = this.max_index - 1;
                if (this.active_index >= this.max_index) this.active_index = 0;
            }
        },
        set_scroll_height() {
            // Method that finds the active entry and scrolls towards it, if it
            // not visible

            // Get the active element
            let active_element =
                this.$refs.commands.getElementsByClassName('active');

            // Scroll to the element
            if (active_element.length > 0) {
                active_element = active_element[0];
                active_element.scrollIntoViewIfNeeded(false);
            }
        },
        execute(index = -1) {
            if (index < 0) index = this.active_index;
            let cmd = this.commands[index];
            cmdlist.execute(cmd.type, cmd.command);
            cmdlist.execute('command', 'command_palette.hide');
        },
        keydown(event) {
            if (event.keyCode == 40) {
                // Arrow down
                this.increase_active_index(1);
                this.$nextTick(this.set_scroll_height);
                event.preventDefault();
                return;
            }
            if (event.keyCode == 38) {
                // Arrow up
                this.increase_active_index(-1);
                this.$nextTick(this.set_scroll_height);
                event.preventDefault();
                return;
            }
            if (event.keyCode == 13) {
                // Enter
                if (this.active_index >= 0) {
                    this.execute();
                    event.preventDefault();
                }
                return;
            }
            if (event.keyCode == 27) {
                // TODO: make this a command
                cmdlist.execute('command', 'command_palette.hide');
                event.preventDefault();
            }
        },
    },
};
</script>