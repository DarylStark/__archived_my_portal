<template>
    <div id="">
        <template v-if="!enabling">
            <p>
                Enabling Two Factor Authentication secures your account by
                requiring a extra factor when logging in. To use 2FA you need a
                authenticator app on your smartphone:
            </p>
            <ul>
                <li>
                    <a
                        href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US"
                        target="_blank"
                        rel="noopener"
                        >Google Authenticator</a
                    >
                </li>
                <li>
                    <a
                        href="https://play.google.com/store/apps/details?id=me.jmh.authenticatorpro&hl=en&gl=US"
                        target="_blank"
                        rel="noopener"
                        >Authenticator Pro</a
                    >
                </li>
            </ul>
            <p>
                After you've installed one of these apps, click the button below
                to enable 2FA.
            </p>
            <Button
                v-on:click="retrieve_key"
                icon="fas fa-key"
                v-bind:disabled="retrieving"
                v-bind:loading="retrieving"
                >Enable</Button
            >
        </template>
        <div class="configuring_2fa" v-if="enabling">
            <p>
                Use the authenticator app on your smartphone to scan the
                following code
            </p>
            <canvas id="canvas"></canvas>
            <p>Enter the given code</p>
            <Input
                id="tfa_code"
                ref="tfa_code"
                v-on:enter="verify_code"
                validate_re="^[0-9]{6}$"
                v-bind:error="code_error"
                v-bind:disabled="verify"
                v-model="code"
            ></Input>
            <Button
                icon="fas fa-key"
                v-bind:disabled="verify"
                v-bind:loading="verify"
                v-on:click="verify_code"
                >Enable 2FA</Button
            >
        </div>
    </div>
</template>

<script>
import Button from '../../components/Button.vue';
import Input from '../../components/Input.vue';
import QRCode from 'qrcode';
import api from '../../my/api';
import APICommand from '../../my/api_command';

export default {
    name: 'Enable2FA',
    data() {
        return {
            retrieving: false,
            enabling: false,
            temp_code: null,
            verify: false,
            code_error: false,
            code: '',
        };
    },
    components: {
        Button,
        Input,
    },
    methods: {
        generate_qr_code() {
            let username =
                this.$store.state.user_session.session.account.username;

            QRCode.toCanvas(
                document.getElementById('canvas'),
                `otpauth://totp/My:${username}?secret=${this.temp_code}&issuer=My`,
                function (error) {
                    // TODO: Give error
                }
            );
        },
        retrieve_key() {
            this.retrieving = true;

            // Step 1: retrieve a 2FA code from the backend
            api.execute(
                new APICommand(
                    'user_account',
                    'get_2fa_code',
                    'GET',
                    null,
                    (data) => {
                        this.temp_code = data.data.code;
                        this.configure();
                    },
                    (error) => {
                        // TODO: ERROR
                        console.log(error);
                    }
                )
            );
        },
        configure() {
            this.enabling = true;
            this.retrieving = false;
            this.$nextTick(() => {
                this.generate_qr_code();
                this.$refs.tfa_code.focus();
            });
        },
        verify_code() {
            if (this.$refs.tfa_code.is_valid()) {
                this.verify = true;
                this.code_error = false;
                this.eventbus.emit('second_factor_setting');

                api.execute(
                    new APICommand(
                        'user_account',
                        'verify_2fa_code',
                        'POST',
                        { code: this.code },
                        (data) => {
                            this.verify = false;
                            this.$store.state.user_session.session.account.second_factor = true;
                            this.eventbus.emit('second_factor_set', true);

                            // Give a toast about the success
                            this.eventbus.emit('toast_show', {
                                title: 'Enabled second factor',
                                text: 'You have enabled two factor authentication on your account!',
                                type: 'success',
                                icon: 'fa-key',
                            });
                        },
                        (error) => {
                            if (
                                error.response.status == 401 ||
                                error.response.status == 403 ||
                                error.response.status == 500
                            ) {
                                this.code_error = true;
                                this.verify = false;
                                this.$nextTick(() =>
                                    this.$refs.tfa_code.focus(true)
                                );
                                this.eventbus.emit('second_factor_set', false);
                            }
                        }
                    )
                );
            } else {
                this.code_error = true;
                this.$refs.tfa_code.focus(true);
            }
        },
    },
};
</script>
