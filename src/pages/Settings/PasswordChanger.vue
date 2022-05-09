<template>
    <div>
        <Input
            v-bind:error="current_password_error"
            id="current_pass"
            v-model="current_password"
            icon="fas fa-lock"
            password
            ref="current_password"
            v-on:enter="focus_next(1)"
            v-bind:disabled="saving"
            >Current password</Input
        >
        <Input
            v-bind:error="new_pass_1_error"
            id="new_pass_1"
            v-model="new_pass_1"
            icon="fas fa-lock"
            password
            ref="new_pass_1"
            v-on:enter="focus_next(2)"
            v-bind:disabled="saving"
            >New password</Input
        >
        <Input
            v-bind:error="new_pass_2_error"
            id="new_pass_2"
            v-model="new_pass_2"
            icon="fas fa-lock"
            password
            ref="new_pass_2"
            v-on:enter="send"
            v-bind:disabled="saving"
            >Repeat new password</Input
        >
        <div class="save">
            <Button
                v-on:click="send"
                icon="fas fa-lock"
                v-bind:disabled="saving"
                v-bind:loading="saving"
                >Change password</Button
            >
        </div>
    </div>
</template>

<script>
import Input from '../../components/Input';
import Button from '../../components/Button';
import Setting from './Setting';
import api from '../../my/api';
import APICommand from '../../my/api_command';
import DateTime from '../../my/datetime';

export default {
    name: 'PasswordChanger',
    components: {
        Input,
        Setting,
        Button,
    },
    data() {
        return {
            current_password: '',
            current_password_error: false,
            new_pass_1: '',
            new_pass_1_error: false,
            new_pass_2: '',
            new_pass_2_error: false,
            saving: false,
        };
    },
    methods: {
        focus() {
            this.$refs.current_password.focus(true);
        },
        focus_next(index) {
            if (index == 1) {
                this.$refs.new_pass_1.focus(true);
            }
            if (index == 2) {
                this.$refs.new_pass_2.focus(true);
            }
        },
        reset() {
            this.current_password = '';
            this.new_pass_1 = '';
            this.new_pass_2 = '';
            this.current_password_error = false;
            this.new_pass_1_error = false;
            this.new_pass_2_error = false;
        },
        send() {
            let fields = ['current_password', 'new_pass_1', 'new_pass_2'];
            fields.forEach((element) => {
                this[element + '_error'] = false;
                if (this[element] == '') {
                    this[element + '_error'] = true;
                }
            });

            if (this.new_pass_1 != this.new_pass_2) {
                this.new_pass_2_error = true;
                return;
            }

            if (this.current_password && this.new_pass_1 && this.new_pass_2) {
                this.saving = true;

                // Emit an event so the parent knows something is happening
                this.eventbus.emit('changing_password');

                // Create data object for the the API request
                let data = {};
                data['current_password'] = this.current_password;
                data['new_password'] = this.new_pass_1;

                api.execute(
                    new APICommand(
                        'user_account',
                        'update_password',
                        'POST',
                        data,
                        (data) => {
                            this.saving = false;
                            this.current_password_error = false;
                            this.eventbus.emit('changed_password', true);

                            // Update the date in the UserSession in the store
                            let dt = new DateTime(new Date(), false);
                            this.$store.commit(
                                'set_password_date',
                                dt.database_string()
                            );

                            // Give a toast about the success
                            this.eventbus.emit('toast_show', {
                                title: 'Password updated',
                                text: 'Your password is changed!',
                                type: 'success',
                                icon: 'fa-lock',
                            });
                        },
                        (error) => {
                            if (
                                error.response.status == 401 ||
                                error.response.status == 403
                            ) {
                                this.current_password_error = true;
                                this.eventbus.emit('changed_password', false);
                                this.eventbus.emit('toast_show', {
                                    title: 'Error while changing password',
                                    text: 'The current password is not correct',
                                    type: 'error',
                                    icon: 'fa-lock',
                                });
                                this.$nextTick(() =>
                                    this.$refs.current_password.focus(true)
                                );
                            }
                            this.saving = false;
                        }
                    )
                );
            }
        },
    },
};
</script>
