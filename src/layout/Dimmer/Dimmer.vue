<template>
    <div id="dimmer" v-on:click="clicked"></div>
</template>

<script>
export default {
    name: 'Dimmer',
    methods: {
        clicked() {
            this.eventbus.emit('dimmer-clicked');
        },
    },
};
</script>
