<template>
    <div v-bind:class="['command', { active: active }]"><slot></slot></div>
</template>

<script>
export default {
    name: 'Command',
    props: {
        active: {
            type: Boolean,
            mandatory: false,
            default: false,
        },
    },
};
</script>