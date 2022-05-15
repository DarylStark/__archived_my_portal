<template>
    <CardList
        id="usersessions"
        v-bind:loading="user_sessions == null"
        ref="list"
    >
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
                    <CardListAction
                        icon="fa-trash"
                        v-bind:action="action_remove"
                        v-bind:action_args="session.id"
                    ></CardListAction>
                </template>
            </CardListItem>
        </template>
        <template v-slot:actions_selected>
            <CardListAction
                list_id="usersessions"
                icon="fa-trash"
                v-bind:action="action_remove_selected"
            ></CardListAction>
        </template>
        <template v-slot:actions>
            <CardListAction
                list_id=""
                icon="fa-arrows-rotate"
                v-bind:action="refresh"
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
import cmdlist from '../../my/command_list';

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
        refresh() {
            cmdlist.execute('command', 'user_sessions.update');
        },
        remove_sessions(sessions) {
            // TODO: Implement
            console.log(sessions);
        },
        action_remove(id) {
            this.remove_sessions([id]);
        },
        action_remove_selected() {
            // Get all ID's of selected elements
            let selected = new Array();
            this.$refs.list.selected.forEach((element) => {
                element = element.replace('session_id_', '');
                selected.push(element);
            });

            // Remove the elements
            this.remove_sessions(selected);
        },
    },
};
</script>
