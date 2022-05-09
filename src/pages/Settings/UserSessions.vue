<template>
    <Card no_padding>
        <UserSessionsLoading v-if="user_sessions == null">
            Loading the user sessions
        </UserSessionsLoading>
        <div
            v-if="user_sessions != null"
            v-for="session in $store.state.api_data.user_sessions"
            v-bind:key="session.id"
        >
            {{ session.id }} --> {{ session.title }}
        </div>
    </Card>
</template>

<script>
import Card from '../../cards/Card';
import UserSessionsLoading from './UserSessionsLoading.vue';

export default {
    name: 'UserSessions',
    components: {
        Card,
        UserSessionsLoading,
    },
    created() {
        // Load the user sessions from the API
        this.$store.commit('get_user_sessions');
    },
    computed: {
        user_sessions() {
            return this.$store.state.api_data.user_sessions;
        },
    },
};
</script>
