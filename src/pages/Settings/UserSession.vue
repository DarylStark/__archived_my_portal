<template>
    <CardListItem list_id="usersessions" v-bind:id="id">
        <div class="settings-usersessions-col-title">
            <EditableText
                v-bind:value="session.title"
                empty_text="No title"
                v-bind:id="id"
                v-bind:done="save_title"
                validate_re="^[A-Za-z0-9]+$"
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
                confirm_first
                v-bind:loading="session.loading"
            ></CardListAction>
        </template>
    </CardListItem>
</template>

<script>
import CardListAction from '../../cards/CardListAction';
import CardListItem from '../../cards/CardListItem.vue';
import EditableText from '../../components/EditableText';

export default {
    name: 'UserSession',
    components: {
        CardListItem,
        CardListAction,
        EditableText,
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
    methods: {
        save_title(new_title) {
            console.log(`Saving that title for id: ${this.session.id}`);
            return true;
        },
        action_remove() {
            this.eventbus.emit('remove_user_session', this.session.id);
        },
    },
};
</script>