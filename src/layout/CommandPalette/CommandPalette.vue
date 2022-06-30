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
                v-for="(command, index) in list_entries"
                v-bind:key="command"
                v-bind:active="index == active_index"
                v-on:click="execute(index)"
                v-bind:keybinding="command.keybinding"
                v-bind:icon="command.icon"
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
import eventbus from '../../dashboard-eventbus';
import router from '../../dashboard-router';

export default {
    name: 'CommandPalette',
    components: { Input, Command },
    created() {
        this.$store.commit('dimmer_visible_set', true);
        this.eventbus.on('dimmer-clicked', this.close);
    },
    mounted() {
        this.$refs.input.focus();
        this.input = this.prompt;
    },
    unmounted() {
        this.$store.commit('dimmer_visible_set', false);
        this.eventbus.off('dimmer-clicked', this.close);
    },
    props: {
        mode: {
            type: String,
            required: true,
            default: 'mixed',
        },
        execute_command: {
            required: false,
        },
        prompt: {
            type: String,
            required: false,
            default: '>',
        },
    },
    data() {
        return {
            input: this.prefix,
            max_index: 0,
            active_index: -1,
        };
    },
    computed: {
        tags() {
            const taglist = this.$store.state.api_data.tags;
            taglist.forEach((tag) => {
                tag.fullname = tag.title;
                tag.show = true;
                tag.type = 'tag';
                tag.command = tag.slug;
                tag.icon = 'fa-hashtag';
            });
            return taglist;
        },
        commands() {
            return cmdlist.commands.filter((cmd) => cmd.show);
        },
        list_entries() {
            let items = new Array();
            let list = this.mode;
            let query = this.input;

            // Find out which list to use
            if (this.mode == 'mixed') {
                // Define the prefixes
                const matches = new Map();
                matches['commands'] = new RegExp('^>(.*)');
                matches['tags'] = new RegExp('^#(.*)');

                // Loop through them to find a map
                if (this.input != undefined) {
                    for (const [key, value] of Object.entries(matches)) {
                        let match = this.input.match(value);
                        if (match) {
                            list = key;
                            query = match[1];
                            break;
                        }
                    }
                }
            }

            // Get the correct list
            if (list in this) items = this[list];

            // Filter the list on input
            if (query && query != '') {
                items = items.filter((item) => {
                    return (
                        item.fullname
                            .toLowerCase()
                            .indexOf(query.toLowerCase()) != -1
                    );
                });
            }

            // Sort the list
            items.sort(this.list_sort);

            // Set the scroll settings
            this.active_index = 0;
            this.max_index = items.length;
            if (this.max_index == 0) this.active_index = -1;

            // Return the generated list
            return items;
        },
    },
    methods: {
        list_sort(first, second) {
            if (first.fullname.toLowerCase() > second.fullname.toLowerCase()) {
                return 1;
            }
            return -1;
        },
        close() {
            this.$store.commit('set_command_palette_command');
            cmdlist.execute('command_palette.hide');
        },
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
            let cmd = this.list_entries[index];

            // Check which action to do
            if (!this.execute_command) {
                if (cmd.type === 'tag') {
                    router.push(`/tags/${cmd.command}`);
                } else {
                    cmdlist.execute(cmd.command);
                }
            } else {
                this.execute_command(cmd);
            }

            // Done; close the palette
            this.close();
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
                // Escape
                this.close();
                eventbus.emit('command_palette_closed_no_save');
                event.preventDefault();
            }
        },
    },
};
</script>