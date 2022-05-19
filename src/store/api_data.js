// Store to save data we receive from the API

import api from '../my/api';
import APICommand from '../my/api_command';
import eventbus from '../dashboard-eventbus';

export default {
    state() {
        return {
            working: new Array(),
            web_ui_settings: null,
            web_ui_settings_error: null,
            user_sessions: null
        }
    },
    mutations: {
        get_settings(state, callbacks = null) {
            if (state.working.indexOf('get_settings') == -1) {
                state.working.push('get_settings');

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

                            // Remove it from the 'working' list
                            state.working = state.working.filter((element) => element != 'get_settings');
                        },
                        (error) => {
                            state.web_ui_settings_error = error;

                            // Run the callback, if set
                            if ('error' in callbacks) callbacks['error'](error);

                            // Remove it from the 'working' list
                            state.working = state.working.filter((element) => element != 'get_settings');
                        }
                    )
                );
            }
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
        },
        get_user_sessions(state, object = null) {
            // Set the object
            if (object == null) {
                object = {
                    callbacks: {}
                }
            }

            // Set the callbacks
            if (!('callbacks' in object)) {
                object['callbacks'] = {}
            }

            // Get the force
            let force = false;
            if ('force' in object) {
                force = object.force;
            }
            if (!force && state.user_sessions == null) force = true;
            if (!force) eventbus.emit('get_user_sessions_done');

            if (state.working.indexOf('get_user_settings') == -1 && force) {
                state.working.push('get_user_settings');
                // Retrieve the user sessions from the database
                api.execute(
                    new APICommand(
                        'user_sessions',
                        'all',
                        'GET',
                        null,
                        (data) => {
                            // Add the 'loading' element to all
                            data.data.forEach((element) => {
                                element.loading = false;
                            });

                            // Set the user sessions
                            state.user_sessions = data.data;

                            // Emit an event
                            eventbus.emit('get_user_sessions_done');

                            // Remove it from the 'working' list
                            state.working = state.working.filter((element) => element != 'get_user_settings');

                            // Emit an event
                            eventbus.emit('get_user_sessions_done');
                        },
                        (error) => {
                            // Run the callback, if set
                            if ('error' in object.callbacks) object.callbacks['error'](error);

                            // Remove it from the 'working' list
                            state.working = state.working.filter((element) => element != 'get_user_settings');

                            // Emit an event
                            eventbus.emit('get_user_sessions_done');
                        }
                    )
                );
            }
        },
        delete_user_sessions(state, object) {
            // Set loading for the affected elements
            state.user_sessions.forEach((e) => {
                if (object.sessions.indexOf(e.id.toString()) != -1 || object.sessions.indexOf(e.id) != -1)
                    e.loading = true;
            })

            // Execute the API
            api.execute(
                new APICommand(
                    'user_sessions',
                    'delete',
                    'DELETE',
                    {
                        session_ids: object.sessions,
                    },
                    (data) => {
                        // Remove all sessions from the state that are deleted
                        state.user_sessions = state.user_sessions.filter((e) => {
                            if (object.sessions.indexOf(e.id.toString()) != -1 || object.sessions.indexOf(e.id) != -1)
                                return false;
                            return true;
                        })

                        // Run the given callback
                        if ('done' in object) object['done'](data);
                    },
                    (error) => {
                        // Remove the loading flag
                        state.user_sessions.forEach((e) => {
                            if (object.sessions.indexOf(e.id.toString()) != -1 || object.sessions.indexOf(e.id) != -1)
                                e.loading = false;
                        })

                        // Run the given callback
                        if ('error' in object) object['error'](error);
                    }
                )
            );
        },
        set_user_session_title(state, object) {
            // Method to set the title of a user session
            let id = object.id;
            let title = object.title;

            // Set loading for the affected element
            state.user_sessions.forEach((e) => {
                if (e.id == object.id)
                    e.loading = true;
            });

            api.execute(
                new APICommand(
                    'user_sessions',
                    'update',
                    'PATCH',
                    {
                        session_id: id,
                        title: title
                    },
                    (data) => {
                        // Update the session title
                        state.user_sessions.forEach((session) => {
                            if (session.id == id) {
                                session.title = title == '' ? null : title;
                                session.loading = false;
                            }
                        });

                        // If it it's the current session, update the current
                        // title
                        if (id == this.state.user_session.session.session.id) {
                            this.state.user_session.session.session.title = title == '' ? null : title;
                        }

                        // Run the given callback
                        if ('done' in object) object['done'](data);
                    },
                    (error) => {
                        // Run the given callback
                        if ('error' in object) object['error'](error);
                    }
                )
            );
        }
    }
};
