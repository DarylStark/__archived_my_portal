<template>
    <div
        v-bind:class="[
            'list_action',
            {
                confirm: state != 'normal',
                spin: loading,
            },
        ]"
        v-on:click="run_action"
    >
        <i v-bind:class="icon_class"></i>
    </div>
</template>

<script>
import Button from '../components/Button.vue';
import Command from '../my/command';
import cmdlist from '../my/command_list';

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
        confirm_first: {
            type: Boolean,
            default: false,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        command: {
            type: Command,
            required: false,
            default: null,
        },
    },
    data() {
        return {
            state: 'normal',
            cancel_timeout: null,
        };
    },
    computed: {
        icon_class() {
            if (this.state != 'confirming') {
                return ['fas', this.icon];
            }
            return ['fas', 'fa-circle-check'];
        },
    },
    created() {
        this.eventbus.on('keydown', this.keypress);
        if (this.command) {
            this.command.method = this.run_action;
            cmdlist.add_command(this.command);
        }
    },
    unmounted() {
        if (this.command) cmdlist.remove_command(this.command);
        this.eventbus.off('keydown', this.keypress);
    },
    methods: {
        keypress(key) {
            // Return to normal mode
            if (key.key == 'ESCAPE') {
                this.state = 'normal';
            }
        },
        run_action() {
            if (!this.loading) {
                if (this.confirm_first && this.state != 'confirming') {
                    // Go to confirm mode
                    this.state = 'confirming';

                    // Set a timeout to cancel confirm mode
                    this.cancel_timeout = setTimeout(() => {
                        this.state = 'normal';
                    }, 10000);

                    // Done
                    return;
                }

                this.action(this.action_args);
                this.state = 'normal';

                // Cancel the timeout
                clearTimeout(this.cancel_timeout);
            }
        },
    },
};
</script>