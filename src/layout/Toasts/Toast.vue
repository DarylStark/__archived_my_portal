<template>
    <div v-bind:class="['toast', type]" v-on:click="dismiss">
        <div class="icon" v-if="icon">
            <i v-bind:class="['fa-solid', icon]"></i>
        </div>
        <div class="title">{{ title }}</div>
        <div class="text">
            {{ text }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'Toast',
    methods: {
        dismiss() {
            // When the toast gets dismissed, we fire a 'dismiss_toast' event so
            // the parent knows to remove it from the stack.
            this.eventbus.emit('toast_dismiss', this.id);
        },
    },
    created() {
        // Create the auto removal of the toast (if set)
        if (this.timeout >= 0) {
            setTimeout(this.dismiss, this.timeout * 1000);
        }
    },
    props: {
        id: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: false,
            default: 'info',
        },
        icon: {
            type: String,
            required: false,
        },
        timeout: {
            type: Number,
            required: false,
            default: 15,
        },
    },
};
</script>