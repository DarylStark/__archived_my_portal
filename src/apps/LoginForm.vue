<template>
    <div id="app_loginform">
        <form v-on:submit="submit_form">
            <Card title_icon="fas fa-user-circle">
                <template #title>Login</template>

                <div v-if="state == 'credentials'" class="form">
                    <Input
                        id="username"
                        ref="username"
                        icon="fas fa-user"
                        placeholder="Username"
                        v-model="username"
                        v-bind:disabled="loading"
                        v-bind:error="invalid_username"
                        validate_re="^[A-Za-z0-9_\.\-]+$"
                    >
                        Username
                    </Input>
                    <Input
                        id="password"
                        password
                        ref="password"
                        icon="fas fa-key"
                        placeholder="Password"
                        v-model="password"
                        v-bind:disabled="loading"
                        v-bind:error="invalid_password"
                        validate_re="^.+$"
                    >
                        Password
                    </Input>
                </div>

                <div v-if="state == 'second_factor'" class="form">
                    <Input
                        id="second_factor"
                        ref="second_factor"
                        icon="fas fa-user"
                        placeholder="Second factor"
                        v-model="second_factor"
                        v-bind:disabled="loading"
                        validate_re="^\d{6}$"
                        v-bind:error="invalid_second_factor"
                    >
                        Two factor authentication code
                    </Input>
                </div>

                <template #actions>
                    <Button
                        icon="fas fa-sign-in-alt"
                        type="submit"
                        ref="submit"
                        v-bind:loading="loading"
                        v-bind:disabled="loading"
                    >
                        Login
                    </Button>
                </template>
            </Card>
        </form>
    </div>
</template>

<script>
import api from '../my/api.js';
import APICommand from '../my/api_command.js';
import Card from '../cards/Card.vue';
import CardTitleAction from '../cards/CardTitleAction.vue';
import Input from '../components/Input.vue';
import Button from '../components/Button.vue';

export default {
    name: 'LoginForm',
    components: {
        Card,
        CardTitleAction,
        Input,
        Button,
    },
    mounted() {
        this.$refs.username.focus();
    },
    data() {
        return {
            username: null,
            password: null,
            second_factor: null,
            invalid_username: false,
            invalid_password: false,
            invalid_second_factor: false,
            loading: false,
            state: 'credentials',
            credentials: {
                username: null,
                password: null,
                second_factor: null,
            },
        };
    },
    methods: {
        set_state(state) {
            // Set the state for the loginform. Can either be 'credentials'
            // or 'second_factor'. If it is 'credentials', the form for the
            // credentials is shown; otherwise, the form for the second
            // factor is shown.

            // Stop the loading
            this.loading = false;

            if (state == 'second_factor') {
                this.state = 'second_factor';
                this.$nextTick(() => this.$refs.second_factor.focus(true));
            } else if (state == 'credentials') {
                this.state = 'credentials';
                this.second_factor = null;
                this.$nextTick(() => this.$refs.username.focus(true));
            }
        },
        submit_form(event) {
            // Prevent the default handler
            event.preventDefault();

            // Set loading
            this.loading = true;

            // Validate the input
            if (this.state == 'credentials') {
                this.invalid_username = !this.$refs.username.is_valid();
                this.invalid_password = !this.$refs.password.is_valid();

                if (this.invalid_username || this.invalid_password) {
                    this.loading = false;
                    this.$refs.username.focus(true);
                    return;
                }
            } else if (this.state == 'second_factor') {
                this.invalid_second_factor =
                    !this.$refs.second_factor.is_valid();

                if (this.invalid_second_factor) {
                    this.loading = false;
                    this.$refs.second_factor.focus(true);
                    return;
                }
            }

            // Fill the object
            this.credentials.username = this.username;
            this.credentials.password = this.password;
            this.credentials.second_factor = null;
            if (this.state == 'second_factor') {
                this.credentials.second_factor = this.second_factor;
            }

            // Set a new 'this' to use in the callbacks
            let vue_this = this;

            // TODO: Get this back
            api.execute(
                new APICommand(
                    'aaa',
                    'login',
                    'POST',
                    this.credentials,
                    function (data) {
                        // Logged in! Redirect the user to the dashboard
                        window.location.href = '/ui/';
                    },
                    function (error) {
                        if (error.error_code == 1) {
                            // User has to provide a second factor code
                            vue_this.set_state('second_factor');
                        } else {
                            // Credentials were wrong
                            vue_this.set_state('credentials');
                        }
                    }
                )
            );
        },
    },
};
</script>
