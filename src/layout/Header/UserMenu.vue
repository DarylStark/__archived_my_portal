<template>
    <div v-bind:class="['usermenu', { active: active }]">
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
            <UserMenuItem icon="fa-cog">Settings</UserMenuItem>
            <UserMenuItem icon="fa-adjust" v-on:click="next_theme"
                >Next theme</UserMenuItem
            >
            <UserMenuItem icon="fa-edit">Rename session</UserMenuItem>
            <UserMenuItem icon="fa-sign-out-alt" v-on:click="logout"
                >Logout</UserMenuItem
            >
        </div>
    </div>
</template>

<script>
import UserMenuItem from './UserMenuItem.vue';

export default {
    name: 'UserMenu',
    components: { UserMenuItem },
    data: function () {
        return {
            active: false,
        };
    },
    methods: {
        next_theme: () => {
            // TODO: Implement
        },
        logout: () => {
            // TODO: Implement
        },
    },
};
</script>
