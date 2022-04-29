<template>
    <div id="toasts">
        <Toast
            v-for="toast in toasts.slice().reverse()"
            v-bind:key="toast"
            v-bind:id="toast.id"
            v-bind:title="toast.title"
            v-bind:text="toast.text"
            v-bind:type="toast.type"
            v-bind:icon="toast.icon"
            v-bind:timeout="toast.timeout"
        ></Toast>
    </div>
</template>

<script>
import Toast from './Toast.vue';
import { createApp, h } from 'vue';

export default {
    name: 'Toasts',
    components: {
        Toast,
    },
    data() {
        return {
            counter: 0,
            toasts: [],
        };
    },
    created() {
        // Create a listener for new toasts
        this.eventbus.on('toast_show', (data) => {
            this.toasts.push({
                id: 'toast-' + this.counter++,
                ...data,
            });
        });

        // Create a listener for toasts that get dismissed
        this.eventbus.on('toast_dismiss', (toast_id) => {
            this.toasts = this.toasts.filter((e) => {
                return e.id != toast_id;
            });
        });
    },
};
</script>