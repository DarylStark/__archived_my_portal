<template>
    <div v-bind:class="['command', { active: active }]">
        <div class="icon">
            <i v-bind:class="['fas', calculated_icon]"></i>
        </div>
        <div class="text"><slot></slot></div>
        <div class="keybinding" v-if="keys">
            <template v-for="(key, index) in keys" v-bind:key="key">
                <div>
                    {{ key }}
                </div>
                <template v-if="index + 1 != keys.length"> + </template>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Command',
    computed: {
        keys() {
            if (this.keybinding) {
                return this.keybinding.get_keys();
            }
            return false;
        },
        calculated_icon() {
            if (this.icon) {
                return this.icon;
            }
            return 'fa-arrow-right-long';
        },
    },
    props: {
        active: {
            type: Boolean,
            mandatory: false,
            default: false,
        },
        keybinding: {
            mandatory: false,
            default: undefined,
        },
        icon: {
            type: String,
            mandatory: false,
        },
    },
};
</script>