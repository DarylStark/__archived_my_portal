// Store to save UI information about the dashboard
export default {
    state() {
        return {
            current_theme: null,
            installed_themes: new Map([
                ['navy', {css_class: 'theme-navy', name: 'Navy'}],
                ['light', {css_class: 'theme-light', name: 'Light'}],
                ['dark', {css_class: 'theme-dark', name: 'Dark'}],
            ]),
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
                if (!state.installed_themes.has(my_color_theme)) {
                    my_color_theme = null;
                }
            }
            else {
                my_color_theme = null;
            }
            // No color theme defined in local storage, set the default
            if (my_color_theme == null) {
                my_color_theme = [...state.installed_themes][0][0];
            }

            // Set the correct class to the 'body' tag
            document.body.className = state.installed_themes.get(my_color_theme).css_class;

            // Save the theme to the store
            state.current_theme = my_color_theme;

            // Save the theme to the local storage
            localStorage.setItem('my_color_theme', my_color_theme);
        },
        navigation_visible_toggle(state) {
            // Method to toggle the visibility of the navigation
            state.navigation_visible = !state.navigation_visible;
        },
    }
};
