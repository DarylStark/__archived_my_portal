<template>
    <Setting v-bind:icon="icon" v-bind:saving="saving" v-bind:error="error">
        <slot></slot>
        <template v-slot:value>
            <Dropdown
                v-on:changed="update_setting"
                v-bind:selected="selected"
                v-bind:disabled="saving"
                v-bind:options="options"
                ref="dropdown"
            ></Dropdown>
        </template>
    </Setting>
</template>

<script>
import Setting from './Setting.vue';
import Dropdown from '../../components/Dropdown.vue';

export default {
    name: 'DropdownSetting',
    data() {
        return {
            selected: '',
            options: [],
            saving: false,
            error: false,
        };
    },
    components: {
        Setting,
        Dropdown,
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
    mounted() {
        this.set_value();
        this.eventbus.on('settings_reloaded', this.set_value);

        // Set the needed options
        if (this.setting == 'theme' && this.setting_type == 'ui') {
            this.options = [
                { value: 'dark', title: 'Dark' },
                { value: 'light', title: 'Light' },
            ];
        }
    },
    unmounted() {
        this.eventbus.off('settings_reloaded', this.set_value);
    },
    methods: {
        set_value() {
            if (this.setting_type == 'ui') {
                this.selected =
                    this.$store.state.api_data.web_ui_settings[this.setting];
                this.$refs.dropdown.set_value(this.selected);
            }
        },
        update_setting() {
            // Save setting
            this.saving = true;
            let value = this.$refs.dropdown.selected_value;

            // If we updated the theme, update the theme for the
            // dashboard now
            if (this.setting == 'theme' && this.setting_type == 'ui') {
                this.$store.commit('set_theme', {
                    theme: value,
                    api: false,
                });
            }

            if (this.setting_type == 'ui') {
                this.$store.commit('set_setting', {
                    setting: this.setting,
                    value: value,
                    done: (data) => {
                        this.saving = false;
                        this.error = false;
                    },
                    error: (error) => {
                        // TODO: give toast
                        this.saving = false;
                        this.error = true;
                        this.$refs.toggle.toggle(false);
                    },
                });
            }
        },
    },
};
</script>