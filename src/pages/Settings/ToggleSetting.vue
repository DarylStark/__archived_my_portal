<template>
    <Setting
        v-bind:icon="['fa-gear', icon]"
        v-on:click="$refs.toggle.toggle()"
        v-bind:saving="saving"
        v-bind:error="error"
    >
        <slot></slot>
        <template v-slot:value>
            <Toggle
                v-on:changed="update_setting"
                v-bind:toggled="toggled"
                v-bind:toc="false"
                v-bind:disabled="saving"
                ref="toggle"
            ></Toggle>
        </template>
    </Setting>
</template>

<script>
import Setting from './Setting.vue';
import Toggle from '../../components/Toggle.vue';
import api from '../../my/api';
import APICommand from '../../my/api_command';

export default {
    name: 'ToggleSetting',
    data() {
        return {
            toggled: false,
            saving: false,
            error: false,
        };
    },
    components: {
        Setting,
        Toggle,
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
        setting_type: {
            type: String,
            required: true,
        },
    },
    created() {
        // Retrieve setting
        if (this.setting_type == 'ui') {
            this.toggled =
                this.$store.state.api_data.web_ui_settings[this.setting] == '1';
        }
    },
    methods: {
        update_setting() {
            // Save setting
            this.saving = true;

            // TODO: move this to the Store so we can update it from anywhere
            if (this.setting_type == 'ui') {
                let value = this.$refs.toggle.value ? '1' : '0';
                api.execute(
                    new APICommand(
                        'web_ui_settings',
                        'set_setting',
                        'POST',
                        {
                            setting: this.setting,
                            value: value,
                        },
                        (data) => {
                            // Done!
                            this.$store.state.api_data.web_ui_settings[
                                this.setting
                            ] = value;
                            this.saving = false;
                            this.error = false;
                        },
                        (error) => {
                            // TODO: give toast
                            this.saving = false;
                            this.error = true;
                            this.$refs.toggle.toggle(false);
                        }
                    )
                );
            }
        },
    },
};
</script>