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

export default {
    name: 'CommandPalette',
    components: { Input, Command },
    mounted() {
        this.$refs.input.focus();
    },
    data() {
        return {
            input: '',
        };
    },
    computed: {
        commands() {
            return cmdlist.get_list(this.input);
        },
    },
    methods: {
        change() {
            console.log('changed');
        },
    },
};
</script>