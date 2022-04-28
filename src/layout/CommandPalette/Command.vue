<template>
    <div v-bind:class="['command', { active: active }]">
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
    },
    props: {
        active: {
            type: Boolean,
            mandatory: false,
            default: false,
        },
        keybinding: {
            mandatory: false,
        },
    },
};
</script>