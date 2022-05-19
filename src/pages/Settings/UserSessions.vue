<template>
    <CardList
        id="usersessions"
        v-bind:loading="user_sessions == null"
        ref="list"
    >
        <UserSessionsLoading v-if="user_sessions == null">
            Loading the user sessions
        </UserSessionsLoading>
        <CardListEmpty v-if="count == 0">
            There are no user sessions
        </CardListEmpty>
        <template v-slot:headers>
            <div class="settings-usersessions-col-title">Session</div>
            <div class="settings-usersessions-col-datetime">Created</div>
        </template>
        <template v-if="user_sessions != null">
            <UserSession
                v-for="session in user_sessions"
                v-bind:key="session.id"
                v-bind:session="session"
            ></UserSession>
        </template>
        <template v-slot:actions_selected>
            <CardListAction
                list_id="usersessions"
                icon="fa-trash"
                v-bind:action="action_remove_selected"
                confirm_first
            ></CardListAction>
        </template>
        <template v-slot:actions>
            <CardListAction
                list_id="usersessions"
                icon="fa-arrows-rotate"
                v-bind:action="refresh"
                v-bind:loading="refreshing"
            ></CardListAction>
        </template>
    </CardList>
</template>

<script>
import CardList from '../../cards/CardList';
import CardListAction from '../../cards/CardListAction';
import CardListEmpty from '../../cards/CardListEmpty';
import UserSessionsLoading from './UserSessionsLoading.vue';
import Button from '../../components/Button';
import Input from '../../components/Input';
import EditableText from '../../components/EditableText';
import cmdlist from '../../my/command_list';
import UserSession from './UserSession.vue';

export default {
    name: 'UserSessions',
    components: {
        CardList,
        UserSessionsLoading,
        CardListAction,
        Button,
        Input,
        EditableText,
        CardListEmpty,
        UserSession,
    },
    created() {
        // Load the user sessions from the API
        if (this.user_sessions == null) {
            this.$store.commit('get_user_sessions', { force: false });
        } else {
            this.refreshing = false;
        }

        // Event handler for the loading of sessions
        this.eventbus.on('get_user_sessions_done', this.stop_refreshing);

        // Event handler for removing individual sessions
        this.eventbus.on('remove_user_session', this.action_remove);
    },
    unmounted() {
        this.eventbus.off('get_user_sessions_done', this.stop_refreshing);
        this.eventbus.off('remove_user_session', this.action_remove);
    },
    computed: {
        user_sessions() {
            return this.$store.state.api_data.user_sessions;
        },
        count() {
            if (this.user_sessions != null) {
                return this.user_sessions.length;
            }
            return -1;
        },
    },
    data() {
        return {
            refreshing: true,
        };
    },
    methods: {
        save_title(event) {
            return true;
        },
        stop_refreshing() {
            this.refreshing = false;
        },
        create_id(id) {
            return `session_id_${id}`;
        },
        get_session_title(title) {
            if (title == null) return 'No title';
            return title;
        },
        refresh() {
            this.refreshing = true;
            cmdlist.execute('command', 'user_sessions.update');
        },
        remove_sessions(sessions) {
            // Delete the user sessions
            this.$store.commit('delete_user_sessions', {
                sessions: sessions,
                done: (data) => {
                    sessions.forEach((session) => {
                        // Emit a event to remove it from the 'selected' list
                        this.eventbus.emit('card_list_changed_usersessions', {
                            action: 'change_selection',
                            id: `session_id_${session}`,
                            type: 'remove',
                        });
                    });
                },
            });
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
