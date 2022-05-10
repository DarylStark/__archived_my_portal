<template>
    <Button v-bind:disabled="disabled"><slot></slot></Button>
</template>

<script>
import Button from '../components/Button.vue';

export default {
    name: 'CardListAction',
    components: {
        Button,
    },
    props: {
        list_id: {
            type: String,
            required: true,
        },
        no_selection_disable: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    data() {
        return {
            disabled: true,
        };
    },
    created() {
        // Create the string for events to listen on
        this.event = `card_list_changed_${this.list_id}_empty`;

        // Listen for the events
        this.eventbus.on(this.event, this.update);

        if (!this.no_selection_disable) {
            this.disabled = false;
        }
    },
    unmounted() {
        this.eventbus.off(this.event, this.update);
    },
    methods: {
        update(value) {
            if (this.no_selection_disable) this.disabled = value;
        },
    },
};
</script>