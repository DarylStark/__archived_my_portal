// Store to save UI information about the dashboard

import cmdlist from '../my/command_list';
import KeyBinding from '../my/keybinding';
import Command from '../my/command';
import eventbus from '../dashboard-eventbus';

export default {
    state() {
        return {
            theme_commands_set: false,
            current_theme: null,
            current_theme_index: null,
            installed_themes: [
                { name: 'dark', css_class: 'theme-dark', full_name: 'Dark' },
                { name: 'light', css_class: 'theme-light', full_name: 'Light' },
            ],
            navigation_visible: true,
            sidebar_available: false,
            sidebar_visible: false,
            device_type: null,
            cmd_palette_visible: false,
            dimmed: false
        }
    },
    mutations: {
        set_theme_commands(state) {
            let store = this;
            state.installed_themes.forEach(function (theme) {
                cmdlist.add_command(
                    new Command({
                        command: 'theme.set_theme_' + theme.name,
                        group: 'Themes',
                        title: theme.full_name,
                        method: store.commit,
                        args: ['set_theme', { 'theme': theme.name }],
                        icon: 'fa-adjust',
                    })
                );
            });

            cmdlist.add_command(
                new Command({
                    command: 'theme.next_theme',
                    group: 'Themes',
                    title: 'Next theme',
                    method: store.commit,
                    args: 'next_theme',
                    icon: 'fa-adjust',
                    keybinding: new KeyBinding(true, false, false, "K")
                })
            );

            state.theme_commands_set = true;
        },
        set_theme(state, theme_obj) {
            let my_color_theme = null;
            let update_api = true;
            if ('theme' in theme_obj) {
                my_color_theme = theme_obj['theme'];
            }

            if ('api' in theme_obj) {
                update_api = theme_obj['a[o'];
            }

            // Method that sets the initial color theme. First, it tries to get
            // a configured color theme from the local storage. If there is
            // none, it sets the first one in the list of `installed_themese`
            if (my_color_theme == null) {
                my_color_theme = this.state.api_data.web_ui_settings['theme'];
            }

            if (my_color_theme) {
                let valid_theme = state.installed_themes.find((item) => {
                    return item.name == my_color_theme;
                });

                if (!valid_theme) {
                    my_color_theme = null;
                }
            }
            else {
                my_color_theme = null;
            }

            // No color theme defined in settings, set the default
            if (my_color_theme == null) {
                my_color_theme = state.installed_themes[0].name;
            }

            let my_color_theme_index = -1;

            // Get the theme
            let theme = state.installed_themes.find((item, index) => {
                my_color_theme_index = index;
                return item.name == my_color_theme;
            });

            // Set the correct class to the 'body' tag
            document.body.className = theme.css_class;

            // Save the theme to the store
            state.current_theme = my_color_theme;
            state.current_theme_index = my_color_theme_index;

            // Save the theme to the settings
            if (update_api) {
                this.commit('set_setting',
                    {
                        setting: 'theme',
                        value: my_color_theme,
                        before_api: () => {
                            // Let the system know the settings are changed
                            eventbus.emit('settings_reloaded');
                        }
                    }
                )
            }
        },
        set_device_type(state) {
            // Calculate the device_type
            let device_type = 'desktop';
            if (window.innerWidth <= 1024) {
                // This is a tablet PC
                device_type = 'tablet';
            }
            if (window.innerWidth <= 799) {
                // This is a mobile phone
                device_type = 'phone';

                // If we change from something to phone, we have to hide the
                // navigation and the sidebar
                if (state.device_type != 'phone') {
                    this.commit('navigation_visible_set', false);
                    this.commit('sidebar_visible_set', false);
                }
            }

            // If we change from phone to something, we have to display the
            // navigation
            if (state.device_type == 'phone' && device_type != 'phone') {
                this.commit('navigation_visible_set', true);
            }

            // Set the device type
            state.device_type = device_type;
        },
        next_theme(state) {
            // Method that activates the next theme
            let next_theme = (state.current_theme_index + 1) % state.installed_themes.length;
            this.commit('set_theme', { theme: state.installed_themes[next_theme].name });
        },
        navigation_visible_toggle(state) {
            // Method to toggle the visibility of the navigation
            state.navigation_visible = !state.navigation_visible;

            // If the navigation is visible and we are on a phone, we need to
            // hide the sidebare
            if (state.navigation_visible && state.device_type == 'phone') {
                state.sidebar_visible = false;
            }
        },
        navigation_visible_set(state, value) {
            // Method to set the visibility of the navigation
            state.navigation_visible = value;

            // If the navigation is visible and we are on a phone, we need to
            // hide the sidebare
            if (state.navigation_visible && state.device_type == 'phone') {
                state.sidebar_visible = false;
            }
        },
        sidebar_visible_toggle(state) {
            // Method to toggle the visibility of the sidebar

            if (!state.sidebar_available) {
                state.sidebar_visible = false;
                return;
            }

            state.sidebar_visible = !state.sidebar_visible;

            // If the sidebar is visible and we are on a phone, we need to hide
            // the navigation
            if (state.sidebar_visible && state.device_type == 'phone') {
                state.navigation_visible = false;
            }
        },
        sidebar_visible_set(state, value) {
            // Method to set the visibility of the sidebar

            if (!state.sidebar_available) {
                state.sidebar_visible = false;
                return;
            }

            state.sidebar_visible = value;

            // If the sidebar is visible and we are on a phone, we need to hide
            // the navigation
            if (state.sidebar_visible && state.device_type == 'phone') {
                state.navigation_visible = false;
            }
        },
        sidebar_available_set(state, value) {
            // Method to set the availability of the sidebar
            state.sidebar_available = value;

            // If the sidebar is unavailble, we hide it as well
            state.sidebar_visible = false;

            // Set the visibility of the sidebar commands
            cmdlist.set_visibility_command(['sidebar.hide', 'sidebar.show', 'sidebar.toggle'], value);
        },
        cmd_palette_available_set(state, value) {
            // Method to set the availability of the command palette
            state.cmd_palette_visible = value;
        },
        dimmer_visible_set(state, value) {
            // Method to enable or disable the dimmer
            state.dimmed = value;
        }
    },
};
