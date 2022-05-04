<template>
    <div id="dashboard">
        <Header></Header>
        <div class="content_nav">
            <Navigation></Navigation>
            <Content></Content>
            <Sidebar></Sidebar>
        </div>
        <Feeter></Feeter>
        <CommandPalette v-if="cmd_palette_visible"></CommandPalette>
        <Toasts></Toasts>
        <Dimmer v-if="dimmed"></Dimmer>
        <SplashScreen
            v-if="loading"
            v-bind:elements="loading_elements"
        ></SplashScreen>
    </div>
</template>

<script>
import Header from '../layout/Header/Header.vue';
import Navigation from '../layout/Navigation/Navigation.vue';
import Content from '../layout/Content/Content.vue';
import Sidebar from '../layout/Sidebar/Sidebar.vue';
import Feeter from '../layout/Feeter/Feeter.vue';
import CommandPalette from '../layout/CommandPalette/CommandPalette.vue';
import APICommand from '../my/api_command';
import api from '../my/api';
import KeyBinding from '../my/keybinding';
import cmdlist from '../my/command_list';
import Command from '../my/command';
import Dimmer from '../layout/Dimmer/Dimmer.vue';
import Toasts from '../layout/Toasts/Toasts.vue';
import SplashScreen from '../layout/SplashScreen/SplashScreen.vue';

export default {
    name: 'Dashboard',
    components: {
        Header,
        Navigation,
        Content,
        Feeter,
        Sidebar,
        CommandPalette,
        Dimmer,
        Toasts,
        SplashScreen,
    },
    computed: {
        cmd_palette_visible() {
            return this.$store.state.ui.cmd_palette_visible;
        },
        dimmed() {
            return this.$store.state.ui.dimmed;
        },
        loading_elements() {
            return [
                {
                    title: 'Setting listeners and commands',
                    loading: this.component_loading,
                    error: false,
                },
                {
                    title: 'Setting theme',
                    loading: this.$store.state.ui.current_theme == null,
                    error: false,
                },
                {
                    title: 'Configuring theme switcher',
                    loading: this.$store.state.ui.theme_commands_set == null,
                    error: false,
                },
                {
                    title: 'Setting device type',
                    loading: this.$store.state.ui.device_type == null,
                    error: false,
                },
                {
                    title: 'Retrieving user session',
                    loading: this.$store.state.user_session.session == null,
                    error: this.$store.state.user_session.session_error != null,
                },
                {
                    title: 'User settings',
                    loading: this.$store.state.api_data.web_ui_settings == null,
                    error:
                        this.$store.state.api_data.web_ui_settings_error !=
                        null,
                },
            ];
        },
        loading() {
            return this.loading_elements
                .map((element) => element.loading || element.error)
                .includes(true);
        },
    },
    data() {
        return {
            component_loading: true,
        };
    },
    created: function () {
        // Set a local variable that the callsbacks can use for 'this'
        let cb_this = this;

        // Set the device type
        this.$store.commit('set_device_type');

        // Get the color theme
        this.$store.commit('set_theme_commands');
        this.$store.commit('set_theme');
        this.$store.commit('get_settings');

        // Add a handler to the resizing of the window
        window.addEventListener('resize', () => {
            this.$store.commit('set_device_type');
        });

        window.addEventListener('keydown', (event) => {
            if (event.key != 'Shift' && event.key != 'Alt') {
                // Create a KeyBinding object
                let binding = new KeyBinding(
                    event.ctrlKey,
                    event.shiftKey,
                    event.altKey,
                    event.key
                );

                // Execute the command. If we receive a true value, the command
                // has been found and we can stop the default browser behaviour
                // for the keybinding.
                if (cmdlist.execute_from_keybinding(binding)) {
                    event.preventDefault();
                } else {
                    // If we don't have a keybinding for this key, we raise an
                    // global event. If there is something, like a menu, that
                    // wants to do something with this, it can
                    cb_this.eventbus.emit('keydown', binding);
                }
            }
        });

        // Retrieve UserSession and User details
        // TODO: move this to a command so we can update it whenever we need
        api.execute(
            new APICommand(
                'user_sessions',
                'current',
                'GET',
                null,
                (data) => {
                    // We have the details. Let's save the user account and the
                    // session to the store for later user
                    cb_this.$store.commit('set_session', data.data);

                    // If no title is set for this session, we give the user a
                    // toast with the option to go to the settingspage to set
                    // a title.
                    if (!data.data.session.title) {
                        cb_this.eventbus.emit('toast_show', {
                            title: 'Usersession has no name',
                            type: 'info',
                            text: 'This usersession has no name set. Setting a name for this session will increase security and gives you the ability to identify the session. Click here to go to the settings to set a name.',
                            icon: 'fa-user-circle',
                            click: () => {
                                cmdlist.execute(
                                    'command',
                                    'user.open_settings'
                                );
                                return true;
                            },
                        });
                    }
                },
                (error) => {
                    // Something went wrong. We set the error in the store
                    // so the Splash Screen knows not to go away
                    cb_this.$store.commit('set_session_error', {
                        error,
                    });
                }
            )
        );

        // Add commands
        cmdlist.add_command(
            new Command({
                command: 'command_palette.show',
                group: 'Command Palette',
                title: 'Show',
                method: this.$store.commit,
                args: ['cmd_palette_available_set', true],
                show: false,
                keybinding: new KeyBinding(true, true, false, 'P'),
            })
        );
        cmdlist.add_command(
            new Command({
                command: 'command_palette.hide',
                group: 'Command Palette',
                title: 'Hide',
                method: this.$store.commit,
                args: ['cmd_palette_available_set', false],
                show: false,
            })
        );
        cmdlist.add_command(
            new Command({
                command: 'user.open_settings',
                group: 'User',
                title: 'Settings',
                method: this.$router.push,
                args: '/settings',
                keybinding: new KeyBinding(true, false, false, ','),
                icon: 'fa-sliders',
            })
        );

        cmdlist.add_command(
            new Command({
                command: 'ui.reload',
                group: 'UI',
                title: 'Restart',
                method: () => location.reload(),
                keybinding: new KeyBinding(true, true, false, 'F5'),
                icon: 'fa-rotate',
            })
        );
        cmdlist.add_command(
            new Command({
                command: 'user.logout',
                group: 'User',
                title: 'Logout',
                method: () => {
                    api.execute(
                        new APICommand(
                            'aaa',
                            'logout',
                            'GET',
                            null,
                            () => {
                                // Logged out; redirect the user to the
                                // login screen
                                window.location.href = '/ui/login';
                            },
                            (error) => {
                                // Something went wrong; print the error in the Console
                                console.log(error);

                                // Give the user a error message on screen
                                cb_this.eventbus.emit('toast_show', {
                                    title: 'Error while logging out',
                                    type: 'error',
                                    text: 'Something went wrong while logging out the user session. Click here to reload the page or see the console for error information',
                                    icon: 'fa-sign-out-alt',
                                    click: () => {
                                        location.reload();
                                        return false;
                                    },
                                });
                            }
                        )
                    );
                },
                icon: 'fa-sign-out-alt',
            })
        );

        // Done with the creation
        this.component_loading = false;
    },
};
</script>
