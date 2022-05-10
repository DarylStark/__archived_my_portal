<template>
    <CardList id="usersessions" v-bind:loading="user_sessions == null">
        <UserSessionsLoading v-if="user_sessions == null">
            Loading the user sessions
        </UserSessionsLoading>
        <template v-if="user_sessions != null">
            <CardListItem
                v-for="session in $store.state.api_data.user_sessions"
                v-bind:key="session.id"
                list_id="usersessions"
                v-bind:id="create_id(session.id)"
            >
                {{ session.id }} --> {{ session.title }} ({{ session.host }})
            </CardListItem>
        </template>
        <template v-slot:actions>
            <CardListAction list_id="usersessions">New</CardListAction>
            <CardListAction list_id="usersessions" no_selection_disable
                >Verwijderen</CardListAction
            >
        </template>
    </CardList>
</template>

<script>
import CardList from '../../cards/CardList';
import CardListAction from '../../cards/CardListAction';
import CardListItem from '../../cards/CardListItem';
import UserSessionsLoading from './UserSessionsLoading.vue';

export default {
    name: 'UserSessions',
    components: {
        CardList,
        UserSessionsLoading,
        CardListAction,
        CardListItem,
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
    methods: {
        create_id(id) {
            return `session_id_${id}`;
        },
    },
};
</script>
