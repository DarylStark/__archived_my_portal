// Store to save UI information about the dashboard
export default {
    state() {
        return {
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
            cmd_palette_visible: false
        }
    },
    mutations: {
        set_theme(state, my_color_theme = null) {
            // Method that sets the initial color theme. First, it tries to get
            // a configured color theme from the local storage. If there is
            // none, it sets the first one in the list of `installed_themese`

            if (my_color_theme == null) {
                my_color_theme = localStorage.getItem('my_color_theme');
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

            // No color theme defined in local storage, set the default
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

            // Save the theme to the local storage
            localStorage.setItem('my_color_theme', my_color_theme);
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
            this.commit('set_theme', state.installed_themes[next_theme].name);
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
            state.sidebar_visible = !state.sidebar_visible;

            // If the sidebar is visible and we are on a phone, we need to hide
            // the navigation
            if (state.sidebar_visible && state.device_type == 'phone') {
                state.navigation_visible = false;
            }
        },
        sidebar_visible_set(state, value) {
            // Method to set the visibility of the sidebar
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
        },
        cmd_palette_available_set(state, value) {
            // Method to set the availability of the command palette
            state.cmd_palette_visible = value;
        },
    },
};
