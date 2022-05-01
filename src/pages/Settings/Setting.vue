<template>
    <div class="setting" v-on:click="edit">
        <div class="icon"><i v-bind:class="['fas', icon]"></i></div>
        <div class="name"><slot></slot></div>
        <div class="value" v-if="!edit_mode">
            {{ value }}
        </div>
        <div class="value" v-if="edit_mode">
            <Input
                type="text"
                flat
                align="right"
                v-model="value"
                ref="input"
                v-on:key="keydown"
                id="test"
            ></Input>
        </div>
    </div>
</template>

<script>
import Input from '../../components/Input.vue';

export default {
    name: 'Setting',
    data() {
        return {
            edit_mode: false,
            saving: false,
        };
    },
    components: {
        Input,
    },
    props: {
        value: {
            type: String,
        },
        icon: {
            type: String,
            default: 'fa-gear',
        },
    },
    methods: {
        edit() {
            this.edit_mode = true;
            this.$nextTick(() => this.$refs.input.focus(true));
        },
        keydown(event) {
            if (event.keyCode == 27) {
                // Cancel
                this.edit_mode = false;
            }

            if (event.keyCode == 13) {
                // Save
                this.saving = true;
            }
        },
    },
};
</script>