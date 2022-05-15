<template>
    <div class="list_action" v-on:click="run_action">
        <i v-bind:class="['fas', icon]"></i>
    </div>
</template>

<script>
import Button from '../components/Button.vue';

export default {
    name: 'CardListAction',
    components: {
        Button,
    },
    props: {
        icon: {
            type: String,
            required: false,
            default: null,
        },
        action: {
            required: true,
        },
        action_args: {
            required: false,
            default: null,
        },
    },
    methods: {
        run_action() {
            this.action(this.action_args);
        },
    },
};
</script>