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

export default {
    name: 'Dashboard',
    components: {
        Header,
        Navigation,
        Content,
        Feeter,
        Sidebar,
        CommandPalette,
    },
    computed: {
        cmd_palette_visible() {
            return this.$store.state.ui.cmd_palette_visible;
        },
    },
    created: function () {
        // Set a local variable that the callsbacks can use for 'this'
        let cb_this = this;

        // Set the device type
        this.$store.commit('set_device_type');

        // Get the color theme
        this.$store.commit('set_theme_commands');
        this.$store.commit('set_theme');

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
                function (data) {
                    // We have the details. Let's save the user account and the
                    // session to the store for later user
                    cb_this.$store.commit('set_session', data.data);
                },
                (error) => {
                    // TODO: give error
                    console.log(error);
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
                            function () {
                                // Logged out; redirect the user to the
                                // login screen
                                window.location.href = '/ui/login';
                            },
                            function () {
                                // TODO: Give an error
                                console.log('Error while logging out');
                            }
                        )
                    );
                },
                icon: 'fa-sign-out-alt',
            })
        );
    },
};
</script>
