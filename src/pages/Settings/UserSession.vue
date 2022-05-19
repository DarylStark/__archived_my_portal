<template>
    <div class="user_session">
        <CardListItem
            list_id="usersessions"
            v-bind:id="id"
            v-bind:loading="session.loading"
        >
            <div class="settings-usersessions-col-title">
                <EditableText
                    v-bind:value="session.title"
                    empty_text="No title"
                    v-bind:id="id"
                    v-bind:done="save_title"
                    validate_re="^[A-Za-z0-9\ \-\._]*$"
                    ref="editabletext"
                    v-bind:disabled="session.loading"
                >
                </EditableText>
            </div>
            <div class="settings-usersessions-col-datetime">
                <DateTimeView v-bind:datetime="session.created"></DateTimeView>
            </div>
            <template v-slot:actions>
                <CardListAction
                    icon="fa-circle-info"
                    v-bind:action="action_info"
                ></CardListAction>
                <CardListAction
                    icon="fa-trash"
                    v-bind:action="action_remove"
                    confirm_first
                    v-bind:loading="session.loading"
                ></CardListAction>
            </template>
        </CardListItem>
        <div v-if="extra_info" class="extra_info">
            This session was initiated from host
            <code>{{ session.host }}</code>
        </div>
    </div>
</template>

<script>
import CardListAction from '../../cards/CardListAction';
import CardListItem from '../../cards/CardListItem.vue';
import EditableText from '../../components/EditableText';
import DateTimeView from '../../components/DateTimeView.vue';

export default {
    name: 'UserSession',
    components: {
        CardListItem,
        CardListAction,
        EditableText,
        DateTimeView,
    },
    props: {
        session: {
            required: true,
        },
    },
    computed: {
        id() {
            return `session_id_${this.session.id}`;
        },
    },
    data() {
        return {
            extra_info: false,
        };
    },
    methods: {
        save_title(new_title) {
            let rv = this.$store.commit('set_user_session_title', {
                id: this.session.id,
                title: new_title,
                done: (data) => {
                    this.$refs.editabletext.stop_input();
                },
                error: (error) => {
                    console.log('ERROR');
                    console.log(error);
                },
            });
        },
        action_remove() {
            this.eventbus.emit('remove_user_session', this.session.id);
        },
        action_info() {
            this.extra_info = !this.extra_info;
        },
    },
};
</script>