<template>
    <Setting
        v-bind:error="error"
        v-bind:saving="saving"
        v-on:click="edit"
        v-bind:icon="icon"
    >
        <slot></slot>
        <template v-slot:value>
            <div class="value" v-if="!edit_mode">
                {{ value }}
            </div>
            <div class="value" v-if="edit_mode">
                <Input
                    v-if="type == 'input'"
                    type="text"
                    flat
                    align="right"
                    v-model="value"
                    ref="input"
                    v-on:key="keydown"
                    v-on:focusout="focusout"
                    id="test"
                    v-bind:disabled="saving"
                    v-bind:validate_re="validate_re"
                ></Input>
            </div>
        </template>
    </Setting>
</template>

<script>
import Setting from './Setting.vue';
import Input from '../../components/Input.vue';
import api from '../../my/api';
import APICommand from '../../my/api_command';

export default {
    name: 'TextSetting',
    data() {
        return {
            edit_mode: false,
            saving: false,
            value: undefined,
            correct_value: undefined,
            error: false,
        };
    },
    components: {
        Input,
        Setting,
    },
    props: {
        icon: {
            type: String,
            default: 'fa-gear',
        },
        setting: {
            type: String,
            required: true,
        },
        validate_re: {
            type: String,
            required: false,
            default: '',
        },
        setting_type: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: false,
            default: 'input',
        },
    },
    created() {
        this.set_value();
        this.eventbus.on('settings_reloaded', this.set_value);
    },
    unmounted() {
        this.eventbus.off('settings_reloaded', this.set_value);
    },
    methods: {
        set_value() {
            if (this.setting_type == 'account') {
                this.value =
                    this.$store.state.user_session.session.account[
                        this.setting
                    ];
                this.correct_value = this.value;
            } else {
                // TODO: Set value for 'normal' setting
            }
        },
        edit() {
            if (!this.saving) {
                this.edit_mode = true;
                this.$nextTick(() => this.$refs.input.focus(true));
            }
        },
        save_setting() {
            this.edit_mode = false;
            this.error = false;
            this.saving = true;

            if (this.value != this.correct_value) {
                if (this.$refs.input.is_valid()) {
                    this.error = false;

                    if (this.setting_type == 'account') {
                        // Create data object for the the API request
                        let data = {};
                        data[this.setting] = this.value;

                        // Do the API request
                        api.execute(
                            new APICommand(
                                'user_account',
                                'set_account_details',
                                'POST',
                                data,
                                (data) => {
                                    this.correct_value = this.value;
                                    this.$store.state.user_session.session.account[
                                        this.setting
                                    ] = this.value;
                                    this.saving = false;
                                },
                                (error) => {
                                    // Error; something went wrong
                                    this.error = true;
                                    this.saving = false;
                                    this.edit();

                                    // Generate a error message
                                    let error_message =
                                        'A unknown error occured while saving this setting.';
                                    if (error.error_code == 1) {
                                        if (this.setting == 'username') {
                                            error_message =
                                                'The username you have chosen is already in use by another user. Please use a different username.';
                                        } else if (this.setting == 'email') {
                                            error_message =
                                                'The e-mailaddress you have chosen is already in use by another user. Please use a different e-mailaddress.';
                                        }
                                    }

                                    // Give a toast
                                    this.eventbus.emit('toast_show', {
                                        title: 'Error while saving setting',
                                        text: error_message,
                                        type: 'error',
                                        icon: this.icon,
                                        click: () => {
                                            this.edit();
                                            return true;
                                        },
                                    });
                                }
                            )
                        );
                    }
                } else {
                    this.saving = false;
                    this.error = true;
                    this.edit();
                }
            } else {
                this.saving = false;
            }
        },
        keydown(event) {
            if (event.keyCode == 27) {
                // Cancel
                this.edit_mode = false;
                this.error = false;
                this.value = this.correct_value;
            }

            if (event.keyCode == 13) {
                // Save
                this.save_setting();
            }
        },
        focusout(event) {
            if (this.value != this.correct_value) {
                this.edit();
            } else {
                this.edit_mode = false;
                this.error = false;
                this.value = this.correct_value;
            }
        },
    },
};
</script>