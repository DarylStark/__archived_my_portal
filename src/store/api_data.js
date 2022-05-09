// Store to save data we receive from the API

import api from '../my/api';
import APICommand from '../my/api_command';

export default {
    state() {
        return {
            web_ui_settings: null,
            web_ui_settings_error: null
        }
    },
    mutations: {
        get_settings(state, callbacks = null) {
            // Set the default settings
            let settings = {
                warn_on_unnamed_session: 1,
                theme: 'dark'
            }

            // Get the callbacks from the given callbacks

            // Retrieve the settings from the database
            api.execute(
                new APICommand(
                    'web_ui_settings',
                    'get_settings',
                    'GET',
                    null,
                    (data) => {
                        // Loop through the settings and update the
                        // 'default_settings' object
                        for (const setting in data.data.settings) {
                            settings[setting] = data.data.settings[setting];
                        }

                        // Set the object in the store
                        state.web_ui_settings = settings;

                        // Set the correct theme
                        this.commit('set_theme', { theme: settings['theme'] });

                        // Run the callback, if set
                        if ('done' in callbacks) callbacks['done'](data);
                    },
                    (error) => {
                        state.web_ui_settings_error = error;

                        // Run the callback, if set
                        if ('error' in callbacks) callbacks['error'](error);
                    }
                )
            );
        },
        set_setting(state, setting_object) {
            if ('setting' in setting_object && 'value' in setting_object) {
                // Save the current value
                let current_value = state.web_ui_settings[setting_object.setting];

                // Update the value in the settings object
                state.web_ui_settings[setting_object.setting] = setting_object.value;

                if ('before_api' in setting_object) setting_object['before_api']();

                api.execute(
                    new APICommand(
                        'web_ui_settings',
                        'set_setting',
                        'POST',
                        {
                            setting: setting_object.setting,
                            value: setting_object.value,
                        },
                        (data) => {
                            // Done!
                            if ('done' in setting_object) setting_object['done'](data);
                        },
                        (error) => {
                            // Reset the value
                            state.web_ui_settings[setting_object.setting] = current_value;

                            // Done!
                            if ('error' in setting_object) setting_object['error'](error);
                        }
                    )
                );
            }
        }
    }
};
