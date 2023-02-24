// Store to save data we receive from the API

import api from '../my/api';
import APICommand from '../my/api_command';
import eventbus from '../dashboard-eventbus';
import { get_tag_slug } from '../my/tags';
import { get_slug_for_name } from '../my/generic';

export default {
    state() {
        return {
            working: new Array(),
            web_ui_settings: null,
            web_ui_settings_error: null,
            user_sessions: null,
            dashboard_tags: new Map(),
            tags: null,
            api_clients: null,
            api_tokens: null
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
                        state.user_sessions.forEach((session) => {
                            if (session.id == id) {
                                session.loading = false;
                            }
                        });

                        // Run the given callback
                        if ('error' in object) object['error'](error);
                    }
                )
            );
        },
        get_tags(state, object = null) {
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
            if (!force && state.tags == null) force = true;
            if (!force) eventbus.emit('get_tags_done');

            if (state.working.indexOf('get_tags') == -1 && force) {
                state.working.push('get_tags');
                // Retrieve the tags from the database
                api.execute(
                    new APICommand(
                        'tags',
                        'all',
                        'GET',
                        null,
                        (data) => {
                            // A empty list gets returned as 'null', so we have
                            // to convert that to a Array
                            if (data.data == null) data.data = new Array();

                            // Add the 'loading' element and a 'slug' to all elements
                            data.data.forEach((element) => {
                                element.loading = false;
                                element.slug = get_tag_slug(element.title);
                            });

                            // Set the tags
                            state.tags = data.data;

                            // Remove it from the 'working' list
                            state.working = state.working.filter((element) => element != 'get_tags');

                            // Emit an event
                            eventbus.emit('get_tags_done');
                        },
                        (error) => {
                            // Run the callback, if set
                            if ('error' in object.callbacks) object.callbacks['error'](error);

                            // Remove it from the 'working' list
                            state.working = state.working.filter((element) => element != 'get_tags');

                            // Emit an event
                            eventbus.emit('get_tags_done');
                        }
                    )
                );
            }
        },
        delete_tags(state, object) {
            // Set loading for the affected elements
            state.tags.forEach((e) => {
                if (object.tags.indexOf(e.id.toString()) != -1 || object.tags.indexOf(e.id) != -1)
                    e.loading = true;
            })

            // Execute the API
            api.execute(
                new APICommand(
                    'tags',
                    'delete',
                    'DELETE',
                    {
                        tag_ids: object.tags,
                    },
                    (data) => {
                        // Remove all tags from the state that are deleted
                        state.tags = state.tags.filter((e) => {
                            if (object.tags.indexOf(e.id.toString()) != -1 || object.tags.indexOf(e.id) != -1)
                                return false;
                            return true;
                        })

                        // TODO: remove the tag from the dashboard lists

                        // Run the given callback
                        if ('done' in object) object['done'](data);
                    },
                    (error) => {
                        // Remove the loading flag
                        state.tags.forEach((e) => {
                            if (object.tags.indexOf(e.id.toString()) != -1 || object.tags.indexOf(e.id) != -1)
                                e.loading = false;
                        })

                        // Run the given callback
                        if ('error' in object) object['error'](error);
                    }
                )
            );
        },
        set_tag(state, object) {
            // Method to set the title of a tag
            let id = object.id;
            let color = object.color;
            let title = object.title;

            // Set loading for the affected element
            state.tags.forEach((e) => {
                if (e.id == object.id)
                    e.loading = true;
            });

            // Create object to send to the backend
            let obj = {
                tag_id: id
            }
            if (color) obj['color'] = color;
            if (title) obj['title'] = title;

            api.execute(
                new APICommand(
                    'tags',
                    'update',
                    'PATCH',
                    obj,
                    (data) => {
                        // Update the tag color
                        state.tags.forEach((tag) => {
                            if (tag.id == id) {
                                if (color) tag.color = color;
                                if (title) {
                                    tag.title = title
                                    tag.slug = get_tag_slug(title)
                                };
                                tag.loading = false;
                            }
                        });

                        // Run the given callback
                        if ('done' in object) object['done'](data);
                    },
                    (error) => {
                        // Update the tag color
                        state.tags.forEach((tag) => {
                            if (tag.id == id) {
                                tag.loading = false;
                            }
                        });
                        // Run the given callback
                        if ('error' in object) object['error'](error);
                    }
                )
            );
        },
        add_tag(state, object) {
            // Create a object to send to the backend
            let obj = {
                title: object.title,
                color: object.color
            }
            // Method to add a tag
            api.execute(
                new APICommand(
                    'tags',
                    'create',
                    'POST',
                    obj,
                    (data) => {
                        // Append the correct items to the tag
                        data.data.loading = false;
                        data.data.slug = get_tag_slug(data.data.title)

                        // Add it to the list
                        state.tags.push(data.data)

                        // Run the given callback
                        if ('done' in object) object['done'](data);
                    },
                    (error) => {
                        // Run the given callback
                        if ('error' in object) object['error'](error);
                    }
                )
            );
        },
        tag_date(state, object) {
            // Method to tag a specific day

            // Create a object to send to the backend
            let obj = {
                date: object.date,
                tag_id: object.tag_id
            }

            api.execute(
                new APICommand(
                    'dashboard',
                    'tag',
                    'POST',
                    obj,
                    (data) => {
                        state.dashboard_tags[object.date].push(data.data);

                        // Update the dashboard counter
                        // TODO: Is this still used? Is it?
                        state.dashboard_counter++;

                        // Run the given callback
                        if ('done' in object) object['done'](data);
                    },
                    (error) => {
                        // Run the given callback
                        if ('error' in object) object['error'](error);
                    }
                )
            );
        },
        untag_date(state, object) {
            // Method to tag a specific day

            // Create a object to send to the backend
            let obj = {
                date: object.date,
                tag_id: object.tag_id
            }

            api.execute(
                new APICommand(
                    'dashboard',
                    'tag',
                    'DELETE',
                    obj,
                    (data) => {
                        // Update local cache
                        state.dashboard_tags[object.date] = state.dashboard_tags[object.date].filter((tag) => tag.tag_id != obj.tag_id);

                        // Update the dashboard counter
                        state.dashboard_counter++;

                        // Run the given callback
                        if ('done' in object) object['done'](data);
                    },
                    (error) => {
                        // Run the given callback
                        if ('error' in object) object['error'](error);
                    }
                )
            );
        },
        update_tags_for_date(state, object) {
            // Method to get the tags for a specific day

            // First, we make sure the key for this date exists in the correct
            // map
            if (!state.dashboard_tags.has(object.date)) {
                state.dashboard_tags.set(object.date, new Array());
            } else if ('force' in object) {
                // If we already have tags and the 'force' option is not set in the
                // given object, we are done
                if (!object.force) {
                    if ('done' in object) object['done']();
                    return;
                }
            } else {
                if ('done' in object) object['done']();
                return;
            }

            // Get from the backend
            api.execute(
                new APICommand(
                    'dashboard',
                    'tags/' + object.date,
                    'GET',
                    null,
                    (data) => {
                        // We have the data
                        if (data.data === null) data.data = new Array();
                        state.dashboard_tags[object.date] = data.data;

                        // Run the given callback
                        if ('done' in object) object['done'](data);
                    },
                    (error) => {
                        console.log(error);
                        // Run the given callback
                        if ('error' in object) object['error'](error);
                    }
                )
            );
        },
        get_api_clients(state, object = null) {
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
            if (!force && state.api_clients == null) force = true;
            if (!force) eventbus.emit('get_api_clients_done');

            if (state.working.indexOf('get_api_clients') == -1 && force) {
                state.working.push('get_api_clients');
                // Retrieve the API clients from the database
                api.execute(
                    new APICommand(
                        'api_clients',
                        'all',
                        'GET',
                        null,
                        (data) => {
                            if (data.data === null) data.data = [];

                            // Add the 'loading' element to all
                            data.data.forEach((element) => {
                                element.loading = false;
                                element.slug = get_slug_for_name(element.app_name);
                            });

                            // Set the API clients
                            state.api_clients = data.data;

                            // Remove it from the 'working' list
                            state.working = state.working.filter((element) => element != 'get_api_clients');

                            // Emit an event
                            eventbus.emit('get_api_clients_done');
                        },
                        (error) => {
                            // Run the callback, if set
                            if ('error' in object.callbacks) object.callbacks['error'](error);

                            // Remove it from the 'working' list
                            state.working = state.working.filter((element) => element != 'get_api_clients');

                            // Emit an event
                            eventbus.emit('get_api_clients_done');
                        }
                    )
                );
            }
        },
        delete_api_clients(state, object) {
            // Set loading for the affected elements
            state.api_clients.forEach((e) => {
                if (object.clients.indexOf(e.id.toString()) != -1 || object.clients.indexOf(e.id) != -1)
                    e.loading = true;
            })

            // Execute the API
            api.execute(
                new APICommand(
                    'api_clients',
                    'delete',
                    'DELETE',
                    {
                        api_client_ids: object.clients,
                    },
                    (data) => {
                        // Remove all sessions from the state that are deleted
                        state.api_clients = state.api_clients.filter((e) => {
                            if (object.clients.indexOf(e.id.toString()) != -1 || object.clients.indexOf(e.id) != -1)
                                return false;
                            return true;
                        });

                        // Run the given callback
                        if ('done' in object) object['done'](data);
                    },
                    (error) => {
                        // Remove the loading flag
                        state.api_clients.forEach((e) => {
                            if (object.clients.indexOf(e.id.toString()) != -1 || object.clients.indexOf(e.id) != -1)
                                e.loading = false;
                        })

                        // Run the given callback
                        if ('error' in object) object['error'](error);
                    }
                )
            );
        },
        add_api_client(state, object) {
            // Create a object to send to the backend
            let obj = {
                app_name: object.app_name,
                app_publisher: object.app_publisher,
                redirect_url: object.redirect_url == null ? '' : object.redirect_url,
            }
            // Method to add a tag
            api.execute(
                new APICommand(
                    'api_clients',
                    'create',
                    'POST',
                    obj,
                    (data) => {
                        // Append the correct items to the tag
                        data.data.loading = false;
                        data.data.slug = get_slug_for_name(obj.app_name);

                        // Add it to the list
                        state.api_clients.push(data.data)

                        // Run the given callback
                        if ('done' in object) object['done'](data);
                    },
                    (error) => {
                        // Run the given callback
                        if ('error' in object) object['error'](error);
                    }
                )
            );
        },
        set_api_client(state, object) {
            // Method to update a API client
            let id = object.id;
            let app_name = object.app_name;
            let app_publisher = object.app_publisher;
            let redirect_url = object.redirect_url;
            let enabled = object.enabled;

            // Set loading for the affected element
            state.api_clients.forEach((e) => {
                if (e.id == object.id)
                    e.loading = true;
            });

            // Create object to send to the backend
            let obj = {
                client_id: id
            }
            if (app_name) obj['app_name'] = app_name;
            if (app_publisher) obj['app_publisher'] = app_publisher;
            if (redirect_url != null && redirect_url != undefined) obj['redirect_url'] = redirect_url;
            if (enabled != null && enabled != undefined) obj['enabled'] = enabled;

            api.execute(
                new APICommand(
                    'api_clients',
                    'update',
                    'PATCH',
                    obj,
                    (data) => {
                        // Update the tag color
                        state.api_clients.forEach((application) => {
                            if (application.id == id) {
                                if (app_name) {
                                    application.app_name = app_name;
                                    application.slug = get_slug_for_name(app_name);
                                };
                                if (app_publisher) application.app_publisher = app_publisher;
                                if (redirect_url != null && redirect_url != undefined) application.redirect_url = redirect_url;
                                if (enabled != null && enabled != undefined) application.enabled = enabled;
                                application.loading = false;
                            }
                        });

                        // Run the given callback
                        if ('done' in object) object['done'](data);
                    },
                    (error) => {
                        // Update the tag color
                        state.api_clients.forEach((application) => {
                            if (application.id == id) {
                                application.loading = false;
                            }
                        });
                        // Run the given callback
                        if ('error' in object) object['error'](error);
                    }
                )
            );
        },
        get_api_tokens(state, object = null) {
            // Set the object
            if (object == null) {
                object = {
                    id: 0,
                    callbacks: {}
                }
            }

            // Set the id
            const app_id = object.id;

            // Set the callbacks
            if (!('callbacks' in object)) {
                object['callbacks'] = {}
            }

            // Set up the cache
            if (state.api_tokens == null || state.api_tokens == undefined) {
                state.api_tokens = new Map();
            }

            // Get the force
            let force = false;
            if ('force' in object) {
                force = object.force;
            }
            if (!force && state.api_tokens[app_id] == null || state.api_tokens[app_id] == undefined) force = true;
            if (!force) eventbus.emit('get_api_tokens_done');

            if (state.working.indexOf('get_api_tokens') == -1 && force) {
                state.working.push('get_api_tokens');
                // Retrieve the API clients from the database
                api.execute(
                    new APICommand(
                        'api_tokens',
                        `all/${app_id}`,
                        'GET',
                        null,
                        (data) => {
                            if (data.data === null) data.data = [];

                            // Add the 'loading' element to all
                            data.data.forEach((element) => {
                                element.loading = false;
                            });

                            // Set the API clients
                            state.api_tokens[app_id] = data.data;

                            // Remove it from the 'working' list
                            state.working = state.working.filter((element) => element != 'get_api_tokens');

                            // Emit an event
                            eventbus.emit('get_api_tokens_done');
                        },
                        (error) => {
                            console.error(error);
                            // Run the callback, if set
                            if ('error' in object.callbacks) object.callbacks['error'](error);

                            // Remove it from the 'working' list
                            state.working = state.working.filter((element) => element != 'get_api_tokens');

                            // Emit an event
                            eventbus.emit('get_api_tokens_done');
                        }
                    )
                );
            }
        },
        delete_api_tokens(state, object) {
            const client_id = object.client_id;

            // Set loading for the affected elements
            state.api_tokens[client_id].forEach((e) => {
                if (object.api_token_ids.indexOf(e.id.toString()) != -1 || object.api_token_ids.indexOf(e.id) != -1)
                    e.loading = true;
            });


            // Execute the API
            api.execute(
                new APICommand(
                    'api_tokens',
                    'delete',
                    'DELETE',
                    {
                        api_token_ids: object.api_token_ids,
                    },
                    (data) => {
                        // Remove all sessions from the state that are deleted
                        state.api_tokens[client_id] = state.api_tokens[client_id].filter((e) => {
                            if (object.api_token_ids.indexOf(e.id.toString()) != -1 || object.api_token_ids.indexOf(e.id) != -1)
                                return false;
                            return true;
                        });

                        // Run the given callback
                        if ('done' in object) object['done'](data);
                    },
                    (error) => {
                        console.error(error);
                        // Remove the loading flag
                        state.api_clients.forEach((e) => {
                            if (object.api_token_ids.indexOf(e.id.toString()) != -1 || object.api_token_ids.indexOf(e.id) != -1)
                                e.loading = false;
                        })

                        // Run the given callback
                        if ('error' in object) object['error'](error);
                    }
                )
            );
        },
    }
};
