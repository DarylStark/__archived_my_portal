/*
 * Module that contains the UI class for 'My Ganymede'
 */

'use strict';

import Cookies from 'js-cookie';
import store from '../store.js';
class UI {
    constructor() {
        // The constructor does:
        // - Define themes and the default theme
        // - Set the theme from cookie

        // Set the possible themes
        this.themes = {
            'dark': {
                'fullname': 'Dark theme',
                'class': 'theme-dark'
            },
            'light': {
                'fullname': 'Light theme',
                'class': 'theme-light'
            }
        };

        // Set the default theme
        this.default_theme = 'dark';

        // Variable for the current theme
        this.current_theme = this.default_theme;

        // Set the theme
        this.set_theme('from_cookie');

        // Set the device type
        this.set_device_type();

        // Add a handler to the 'resize' event for the window. In this
        // handler, we can make sure the device type gets set again
        window.onresize = () => {
            this.set_device_type();
        }
    }

    get_theme_from_cookie() {
        // Method to get the configured theme from cookie

        let cookie_theme = Cookies.get('theme');
        if (cookie_theme) {
            this.current_theme = cookie_theme;
            return;
        }
        this.current_theme = this.default_theme;
    }

    set_theme(theme = 'from_cookie') {
        // Method to set the UI to a specific theme

        // If the user specified that we have to retrieve the theme
        // from a cookie, we can retrieve the value now
        if (theme === 'from_cookie') {
            this.get_theme_from_cookie();
            theme = this.current_theme;
        }

        // If the user gave an undefined theme, or gave the theme
        // 'default', we have to use the default theme.
        if (Object.keys(this.themes).indexOf(theme) === -1 || theme === 'default' || !theme) {
            theme = this.default_theme;
        }

        // Save the theme for later user
        Cookies.set('theme', theme);

        // Set the theme for the object
        this.current_theme = theme;

        // Set the CSS class to the body for this theme
        document.body.className = this.themes[theme]['class'];
    }

    get_current_theme_index() {
        // Method that returns the index of the current theme
        return Object.keys(this.themes).indexOf(this.current_theme);
    }

    next_theme() {
        // Method to find the theme that is now being used and then set
        // the theme to the next one. This can be used to walk through
        // the available themes

        let theme_names = Object.keys(this.themes)
        let current_index = this.get_current_theme_index();
        let new_index = current_index + 1;
        if (new_index >= theme_names.length) {
            new_index = 0;
        }

        // Set the theme
        this.set_theme(theme_names[new_index]);
    }

    set_device_type() {
        // Method that sets the device type
        let max_width_tablet = 1024;
        let max_width_phone = 799;

        // Determine the device type by it's window size
        let device_type = 'pc';
        let window_width = document.body.clientWidth;
        if (window_width <= max_width_phone) {
            device_type = 'phone';
        } else if (window_width <= max_width_tablet) {
            device_type = 'tablet';
        }

        // Update the central store
        store.commit('set_device_type', device_type);
    }
}

/*
 * Export the class
 */

export default UI;
