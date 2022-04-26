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
import cmdlist from '../my/command_list';

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

        // Retrieve UserSession and User details
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
            'global',
            'Command Palette',
            'command_palette.show',
            'Show',
            this.$store.commit,
            ['cmd_palette_available_set', true]
        );
        cmdlist.add_command(
            'global',
            'Command Palette',
            'command_palette.hide',
            'Hide',
            this.$store.commit,
            ['cmd_palette_available_set', false]
        );
        cmdlist.add_command(
            'global',
            'User',
            'user.open_settings',
            'Settings',
            this.$router.push,
            '/settings'
        );
        cmdlist.add_command(
            'global',
            'User',
            'user.logout',
            'Logout',
            function () {
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
            }
        );
    },
};
</script>
