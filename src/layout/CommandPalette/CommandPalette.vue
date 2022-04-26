<template>
    <div id="command_palette">
        <div id="input">
            <Input
                id="input"
                v-model="input"
                ref="input"
                v-on:change="change"
            ></Input>
        </div>
        <div id="commands">
            <Command v-for="command in commands" v-bind:key="command">
                {{ command.fullname }}
            </Command>
        </div>
    </div>
</template>

<script>
import Input from '../../components/Input.vue';
import Command from './Command.vue';
import cmdlist from '../../my/command_list';

let search_prefixes = new Map([
    ['#', 'tags'],
    ['>', 'notes'],
    ['@', 'rss'],
]);

export default {
    name: 'CommandPalette',
    components: { Input, Command },
    mounted() {
        this.$refs.input.focus();
        console.log('Mounted!');
    },
    data() {
        return {
            input: '',
            list: 'commands',
        };
    },
    computed: {
        commands() {
            // Default search
            let search = this.input;

            // Default list
            this.list = 'commands';

            // Get the correct prefix
            let prefix = search_prefixes.get(search[0]);
            console.log(prefix);
            if (prefix) {
                this.list = prefix;
                search = search.substring(1);
            }

            return cmdlist.get_list(search, this.list);
        },
    },
    methods: {
        change() {
            console.log('changed');
        },
    },
};
</script>