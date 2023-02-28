<template>
    <Card no_padding>
        <TokensLoading v-if="loading">Loading token information</TokensLoading>
        <template v-if="!loading">
            <div class="token_info_text">
                This token is created at
                <b
                    ><DateTimeView
                        v-bind:datetime="token.created"
                    ></DateTimeView
                ></b>
                and is authorized for the following scopes:
            </div>
            <div class="scopes">
                <TokenScope
                    v-for="token_scope in token_scopes"
                    v-bind:key="token_scope.id"
                    v-bind:token_scope="token_scope"
                    v-bind:removal_event="removal_event"
                ></TokenScope>
            </div>
        </template>
    </Card>
</template>

<script>
import Card from '../../../cards/Card';
import CardListAction from '../../../cards/CardListAction';
import DateTimeView from '../../../components/DateTimeView';
import TokensLoading from './TokensLoading.vue';
import TokenScope from './TokenScope.vue';

export default {
    name: 'TokenInfo',
    components: {
        Card,
        DateTimeView,
        TokensLoading,
        CardListAction,
        TokenScope,
    },
    props: {
        token: {
            required: true,
        },
    },
    computed: {
        loading() {
            return (
                this.$store.state.api_data.api_token_scopes_token_ids.indexOf(
                    this.token.id
                ) == -1
            );
        },
        token_scopes() {
            if (!this.loading)
                return this.$store.state.api_data.api_token_scopes.filter(
                    (element) => element.token_id == this.token.id
                );
            return new Array();
        },
        removal_event() {
            return `remove_token_scope_${this.token.id}`;
        },
    },
    created() {
        // Retrieve tokens
        this.$store.commit('get_api_token_scopes', { token_id: this.token.id });

        // Sign up for removal events
        this.eventbus.on(this.removal_event, this.remove_token_scope);
    },
    unmounted() {
        this.eventbus.off(this.removal_event, this.remove_token_scope);
    },
    methods: {
        remove_token_scope(id) {
            this.remove_token_scopes([id]);
        },
        remove_token_scopes(token_scope_ids) {
            // Delete the user sessions
            this.$store.commit('delete_api_token_scope', {
                token_scope_ids: token_scope_ids,
            });
        },
    },
};
</script>
