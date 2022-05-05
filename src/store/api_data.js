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
    }
};
