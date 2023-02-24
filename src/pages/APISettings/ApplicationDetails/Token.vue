<template>
    <div>
        <CardListItem v-bind:id="id" list_id="api_settings_tokens">
            <div>
                <EditableText
                    v-bind:value="title"
                    empty_text="No title set"
                    id="token_name"
                    v-bind:done="save_title"
                    ref="editabletext_token_title"
                    v-bind:disabled="loading"
                >
                </EditableText>
            </div>
            <template v-slot:actions>
                <CardListAction
                    icon="fa-circle-info"
                    v-bind:action="action_permissions"
                ></CardListAction>
                <CardListAction
                    icon="fa-trash"
                    v-bind:action="action_remove"
                    confirm_first
                    v-bind:loading="loading"
                ></CardListAction>
            </template>
        </CardListItem>
        <TokenInfo
            v-if="show_permissions"
            v-bind:token_id="token.id"
        ></TokenInfo>
    </div>
</template>

<script>
import Card from '../../../cards/Card';
import CardListItem from '../../../cards/CardListItem';
import CardListAction from '../../../cards/CardListAction';
import TokenInfo from './TokenInfo.vue';
import EditableText from '../../../components/EditableText';

export default {
    name: 'Token',
    components: {
        CardListItem,
        CardListAction,
        Card,
        TokenInfo,
        EditableText,
    },
    props: {
        token: {
            requuired: true,
        },
    },
    data() {
        return {
            show_permissions: false,
            loading: false,
            title: null,
        };
    },
    computed: {
        id() {
            return `token_id_${this.token.id}`;
        },
    },
    created() {
        this.eventbus.on('api_tokens_set_loading', this.event_set_loading);
        this.title = this.token.title;
    },
    unmounted() {
        this.eventbus.off('api_tokens_set_loading', this.event_set_loading);
    },
    methods: {
        action_permissions() {
            this.show_permissions = !this.show_permissions;
        },
        action_remove() {
            this.eventbus.emit('remove_api_token', this.token.id);
        },
        event_set_loading(token_id) {
            console.log(token_id);
            if (token_id == this.token.id) this.loading = true;
        },
        save_title(new_title) {
            this.$store.commit('set_api_token', {
                id: this.token.id,
                client_id: this.token.client_id,
                title: new_title,
                done: (data) => {
                    this.title = new_title;
                    this.$refs.editabletext_token_title.stop_input();
                },
                error: (error) => {
                    this.eventbus.emit('toast_show', {
                        title: 'Error while changing title',
                        text: 'There was a error while changing the title of this token.',
                        type: 'error',
                        icon: 'fa-link',
                    });

                    this.$refs.editabletext_token_title.error = true;
                    this.$refs.editabletext_token_title.focus(true);
                },
            });
        },
    },
};
</script>
