// Store to save UI information about the dashboard
export default {
    state() {
        return {
            current_theme: null,
            current_theme_index: null,
            installed_themes: [
                { name: 'navy', css_class: 'theme-navy', full_name: 'Navy' },
                { name: 'light', css_class: 'theme-light', full_name: 'Light' },
                { name: 'dark', css_class: 'theme-dark', full_name: 'Dark' },
            ],
            navigation_visible: true,
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

            console.log(my_color_theme);
        },
        next_theme(state) {
            // Method that activates the next theme
            let next_theme = (state.current_theme_index + 1) % state.installed_themes.length;
            this.commit('set_theme', state.installed_themes[next_theme].name);
        },
        navigation_visible_toggle(state) {
            // Method to toggle the visibility of the navigation
            state.navigation_visible = !state.navigation_visible;
        },
    }
};
