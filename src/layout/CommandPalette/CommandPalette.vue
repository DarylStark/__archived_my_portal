<template>
    <div id="command_palette">
        <div id="cmdinput"><Input id="cmd"></Input></div>
        <div id="commands">
            <Command v-for="command in commands" v-bind:key="command">
                <template v-slot:group>{{ command.group }}</template>
                {{ command.title }}
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
    created() {
        cmdlist.sort();
    },
    computed: {
        commands() {
            return cmdlist.list;
        },
    },
};
</script>