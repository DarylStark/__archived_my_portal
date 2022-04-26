<template>
    <div id="command_palette">
        <div id="input">
            <Input
                id="input"
                v-model="input"
                ref="input"
                v-on:keypress="keypress"
            ></Input>
        </div>
        <div id="commands" ref="commands">
            <Command
                v-for="(command, index) in commands"
                v-bind:key="command"
                v-bind:active="index == active_index"
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
        keypress(event) {
            if (event.keyCode == 40) {
                this.increase_active_index(1);
                this.$nextTick(this.set_scroll_height);
                return;
            }
            if (event.keyCode == 38) {
                this.increase_active_index(-1);
                this.$nextTick(this.set_scroll_height);
                return;
            }
            if (event.keyCode == 13) {
                console.log('execute command: ');
                console.log(this.active_index);
                console.log(this.commands[this.active_index]);
                return;
            }
        },
    },
};
</script>