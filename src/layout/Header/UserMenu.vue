<template>
    <div
        v-bind:class="['usermenu', { active: active }]"
        v-if="$store.state.user_session.session"
    >
        <div class="button" v-on:click="active = !active">
            <div
                v-if="
                    $store.state.user_session.session.account.fullname &&
                    $store.state.ui.device_type != 'phone'
                "
            >
                {{ $store.state.user_session.session.account.fullname }}
            </div>
            <i class="fas fa-user-circle"></i>
        </div>
        <div class="menu">
            <UserMenuItem icon="fa-terminal" v-on:click="show_cmd_palette"
                >Command palette</UserMenuItem
            >
            <UserMenuItem icon="fa-sliders" v-on:click="show_settings"
                >Settings</UserMenuItem
            >
            <UserMenuItem
                v-for="theme in installed_themes"
                icon="fa-adjust"
                v-on:click="set_theme(theme)"
                v-bind:key="theme.name"
            >
                Set theme: {{ theme['full_name'] }}
            </UserMenuItem>
            <UserMenuItem icon="fa-edit">Rename session</UserMenuItem>
            <UserMenuItem icon="fa-sign-out-alt" v-on:click="logout"
                >Logout</UserMenuItem
            >
        </div>
    </div>
</template>

<script>
import UserMenuItem from './UserMenuItem.vue';
import cmdlist from '../../my/command_list';

export default {
    name: 'UserMenu',
    components: { UserMenuItem },
    data: function () {
        return {
            active: false,
        };
    },
    computed: {
        installed_themes() {
            return this.$store.state.ui.installed_themes;
        },
    },
    methods: {
        show_settings() {
            cmdlist.execute('command', 'user.open_settings');
            this.active = false;
        },
        set_theme(theme) {
            this.$store.commit('set_theme', theme.name);
        },
        show_cmd_palette() {
            cmdlist.execute('command', 'command_palette.show');
            this.active = false;
        },
        logout() {
            cmdlist.execute('command', 'user.logout');
            this.active = false;
        },
    },
};
</script>
