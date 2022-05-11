<template>
    <CardList id="usersessions" v-bind:loading="user_sessions == null">
        <UserSessionsLoading v-if="user_sessions == null">
            Loading the user sessions
        </UserSessionsLoading>
        <template v-slot:headers>
            <div class="settings-usersessions-col-title">Session</div>
            <div class="settings-usersessions-col-datetime">Host</div>
        </template>
        <template v-if="user_sessions != null">
            <CardListItem
                v-for="session in $store.state.api_data.user_sessions"
                v-bind:key="session.id"
                list_id="usersessions"
                v-bind:id="create_id(session.id)"
            >
                <div class="settings-usersessions-col-title">
                    <EditableText
                        v-bind:value="session.title"
                        empty_text="No title"
                    >
                    </EditableText>
                </div>
                <div class="settings-usersessions-col-datetime">
                    {{ session.created }}
                </div>

                <template v-slot:actions>
                    <CardListAction icon="fa-trash"></CardListAction>
                </template>
            </CardListItem>
        </template>
        <template v-slot:actions>
            <CardListAction
                list_id="usersessions"
                no_selection_disable
                icon="fa-trash"
            ></CardListAction>
        </template>
    </CardList>
</template>

<script>
import CardList from '../../cards/CardList';
import CardListAction from '../../cards/CardListAction';
import CardListItem from '../../cards/CardListItem';
import UserSessionsLoading from './UserSessionsLoading.vue';
import Button from '../../components/Button';
import Input from '../../components/Input';
import EditableText from './EditableText';

export default {
    name: 'UserSessions',
    components: {
        CardList,
        UserSessionsLoading,
        CardListAction,
        CardListItem,
        Button,
        Input,
        EditableText,
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
        get_session_title(title) {
            console.log(title);
            if (title == null) return 'No title';
            return title;
        },
    },
};
</script>
