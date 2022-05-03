<template>
    <div>
        <p>
            Disabling Two Factor Authentication cannot be undone. If you want to
            use 2FA after disabling it, you have to reconfigure your smartphone.
        </p>
        <Button
            icon="fas fa-key"
            critical
            v-on:click="disable_2fa"
            v-bind:loading="saving"
            v-bind:disabled="saving"
            >Disable 2FA</Button
        >
    </div>
</template>

<script>
import Button from '../../components/Button.vue';
import api from '../../my/api';
import APICommand from '../../my/api_command';

export default {
    name: 'Disable2FA',
    components: {
        Button,
    },
    data() {
        return {
            saving: false,
        };
    },
    methods: {
        disable_2fa() {
            this.saving = true;
            this.eventbus.emit('second_factor_setting');
            api.execute(
                new APICommand(
                    'user_account',
                    'disable_2fa',
                    'GET',
                    null,
                    (data) => {
                        this.saving = false;
                        this.$store.state.user_session.session.account.second_factor = false;
                        this.eventbus.emit('second_factor_disabled', true);

                        // Give a toast about the success
                        this.eventbus.emit('toast_show', {
                            title: 'Disabled second factor',
                            text: 'You have disabled two factor authentication on your account!',
                            type: 'success',
                            icon: 'fa-key',
                        });
                    },
                    (error) => {
                        this.saving = false;
                        this.eventbus.emit('second_factor_disabled', false);

                        this.eventbus.emit('toast_show', {
                            title: 'Disabled second factor',
                            text: 'Something went wrong while disabling two factor authentication',
                            type: 'error',
                            icon: 'fa-key',
                        });
                    }
                )
            );
        },
    },
};
</script>
