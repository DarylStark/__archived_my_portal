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
                        confirm_first
                        v-bind:loading="session.loading"
                    ></CardListAction>
                </template>
            </CardListItem>
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
                list_id=""
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
import CardListItem from '../../cards/CardListItem';
import CardListEmpty from '../../cards/CardListEmpty';
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
        CardListEmpty,
    },
    created() {
        // Load the user sessions from the API
        this.$store.commit('get_user_sessions');

        // Event handler for the loading of sessions
        this.eventbus.on('get_user_sessions_done', this.stop_refreshing);
    },
    unmounted() {
        this.eventbus.off('get_user_sessions_done', this.stop_refreshing);
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
