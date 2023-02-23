<template>
    <div>
        <CardListItem v-bind:id="id" list_id="tokens">
            <div><slot></slot></div>
            <template v-slot:actions>
                <CardListAction
                    icon="fa-arrows-to-circle"
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
        <TokenScopes v-if="show_permissions" token_id="1"></TokenScopes>
    </div>
</template>

<script>
import Card from '../../../cards/Card';
import CardListItem from '../../../cards/CardListItem';
import CardListAction from '../../../cards/CardListAction';
import TokenScopes from './TokenScopes.vue';

export default {
    name: 'Token',
    components: {
        CardListItem,
        CardListAction,
        Card,
        TokenScopes,
    },
    props: {
        token_id: {
            type: Number,
            requuired: true,
        },
    },
    data() {
        return {
            loading: false,
            show_permissions: false,
        };
    },
    computed: {
        id() {
            return `token_id_${this.token_id}`;
        },
    },
    methods: {
        action_permissions() {
            this.show_permissions = !this.show_permissions;
        },
        action_remove() {
            this.eventbus.emit('remove_api_token', this.token_id);
        },
    },
};
</script>
