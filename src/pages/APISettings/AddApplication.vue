<template>
    <Card class="add_form">
        <template v-slot:title>Add application</template>
        <template v-slot:title_actions>
            <CardTitleAction
                icon="fa-xmark"
                v-bind:action="cancel"
            ></CardTitleAction>
        </template>
        <Input
            v-bind:error="error_app_name"
            id="app_name"
            v-model="app_name"
            icon="fas fa-edit"
            ref="app_name"
            v-on:enter="focus_next(1)"
            v-bind:disabled="saving"
            validate_re="^[a-zA-Z][a-zA-Z0-9\ \-]+$"
            >Application name</Input
        >
        <Input
            v-bind:error="error_app_publisher"
            id="app_publisher"
            v-model="app_publisher"
            icon="fas fa-building"
            ref="app_publisher"
            v-on:enter="focus_next(2)"
            v-bind:disabled="saving"
            validate_re="^[a-zA-Z][a-zA-Z0-9\ \-]+$"
            >Publisher</Input
        >
        <Input
            v-bind:error="error_redirect_url"
            id="redirect_url"
            v-model="redirect_url"
            icon="fas fa-globe"
            ref="redirect_url"
            v-on:enter="focus_next(3)"
            v-bind:disabled="saving"
            >Redirect URL (optional)</Input
        >

        <div class="save">
            <Button
                v-on:click="save"
                icon="fas fa-lock"
                v-bind:disabled="saving"
                v-bind:loading="saving"
                >Add application</Button
            >
        </div>
    </Card>
</template>

<script>
import Card from '../../cards/Card';
import CardTitleAction from '../../cards/CardTitleAction';
import Input from '../../components/Input';
import Button from '../../components/Button';
import cmdlist from '../../my/command_list';
import Command from '../../my/command';
import KeyBinding from '../../my/keybinding';

export default {
    name: 'AddApplication',
    components: {
        Card,
        Input,
        Button,
        CardTitleAction,
    },
    created() {
        // Local Vue object
        let vue_this = this;

        // Add commands
        cmdlist.add_command(
            new Command({
                command: 'api_settings.cancel_adding',
                scope: 'local-api-settings-adding',
                group: 'API settings',
                title: 'Cancel adding',
                icon: 'fa-plus',
                method: () => {
                    vue_this.cancel();
                },
                keybinding: new KeyBinding(false, false, false, 'ESCAPE'),
            })
        );
    },
    mounted() {
        this.$refs.app_name.focus();
    },
    beforeUnmount() {
        cmdlist.remove_command_scope('local-api-settings-adding');
    },
    data() {
        return {
            app_name: null,
            app_publisher: null,
            redirect_url: null,
            saving: false,
            error_app_name: false,
            error_app_publisher: false,
            error_redirect_url: false,
        };
    },
    methods: {
        save() {
            this.saving = true;

            // Validate input
            this.error_app_name = !this.$refs.app_name.is_valid();
            this.error_app_publisher = !this.$refs.app_publisher.is_valid();

            if (
                [this.error_app_name, this.error_app_publisher].indexOf(true) >
                -1
            ) {
                // Something went wrong while saving
                this.saving = false;
                if (this.error_app_name) this.$refs.app_name.focus(true);
                else if (this.error_app_publisher)
                    this.$refs.app_publisher.focus(true);

                return;
            }

            // Local Vue object
            let vue_this = this;

            // Add the API Client
            this.$store.commit('add_api_client', {
                app_name: this.app_name,
                app_publisher: this.app_publisher,
                redirect_url: this.redirect_url,
                done(data) {
                    vue_this.saving = false;
                    vue_this.cancel();
                },
                error(error) {
                    // TODO: Error toast
                    vue_this.saving = false;
                    console.log('error');
                },
            });
        },
        cancel() {
            if (!this.saving) this.eventbus.emit('add_application_cancelled');
        },
        focus_next(index) {
            if (index == 1) this.$refs.app_publisher.focus();
            if (index == 2) this.$refs.redirect_url.focus();
            if (index == 3) this.save();
        },
    },
};
</script>
