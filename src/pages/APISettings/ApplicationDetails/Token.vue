<template>
    <div>
        <CardListItem v-bind:id="id" list_id="api_settings_tokens">
            <div>
                <template v-if="token.title">
                    {{ token.title }}
                </template>

                <template v-if="!token.title">No title</template>
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

export default {
    name: 'Token',
    components: {
        CardListItem,
        CardListAction,
        Card,
        TokenInfo,
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
        };
    },
    computed: {
        id() {
            return `token_id_${this.token.id}`;
        },
    },
    created() {
        this.eventbus.on('api_tokens_set_loading', this.event_set_loading);
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
    },
};
</script>
