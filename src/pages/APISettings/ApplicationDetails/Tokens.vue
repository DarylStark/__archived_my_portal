<template>
    <Cell cols="12" class="api_settings_tokens">
        <CardList id="api_settings_tokens" v-bind:checkbox="true" ref="list">
            <template v-slot:headers><div>Title</div></template>

            <TokensLoading v-if="api_tokens == null">
                Loading the API applications
            </TokensLoading>

            <CardListEmpty v-if="count == 0">
                There are no API tokens for this client
            </CardListEmpty>

            <template v-slot:actions_selected>
                <CardListAction
                    list_id="tokens"
                    icon="fa-trash"
                    v-bind:action="action_remove_selected"
                    v-bind:command="cmd_delete"
                    confirm_first
                ></CardListAction>
            </template>
            <template v-slot:actions>
                <CardListAction
                    list_id="tokens"
                    icon="fa-arrows-rotate"
                    v-bind:action="action_refresh"
                    v-bind:loading="refreshing"
                ></CardListAction>
            </template>

            <template v-if="count > 0">
                <Token
                    v-for="token in api_tokens"
                    v-bind:key="token.id"
                    v-bind:token="token"
                >
                </Token>
            </template>
        </CardList>
    </Cell>
</template>

<script>
import Cell from '../../../layout/Grid/Cell';
import CardList from '../../../cards/CardList';
import CardListAction from '../../../cards/CardListAction';
import CardListEmpty from '../../../cards/CardListEmpty';
import Token from './Token';
import TokensLoading from './TokensLoading';
import cmdlist from '../../../my/command_list';
import Command from '../../../my/command';
import KeyBinding from '../../../my/keybinding';

export default {
    name: 'Tokens',
    components: {
        Cell,
        CardList,
        Token,
        CardListAction,
        CardListEmpty,
        TokensLoading,
    },
    props: {
        app_id: {
            type: Number,
            required: true,
        },
    },
    computed: {
        api_tokens() {
            this.reloader;
            if (this.tokens_loaded) {
                if (this.$store.state.api_data.api_tokens[this.app_id])
                    return this.$store.state.api_data.api_tokens[this.app_id];
            }
            return null;
        },
        count() {
            this.reloader;
            if (this.tokens_loaded)
                if (this.api_tokens != null) return this.api_tokens.length;
            return -1;
        },
    },
    data() {
        return {
            refreshing: true,
            tokens_loaded: false,
            reloader: true,
            cmd_delete: new Command({
                command: 'api_tokens.remove',
                scope: 'local-api-tokens',
                group: 'Tokens',
                title: 'Remove selected tokens',
                icon: 'fa-trash',
                show: true,
                keybinding: new KeyBinding(false, false, false, 'DELETE'),
            }),
        };
    },
    created() {
        // Event handler for the loading of API clients
        this.eventbus.on('get_api_tokens_done', this.stop_refreshing);

        // Event handler for removing individual sessions
        this.eventbus.on('remove_api_token', this.action_remove);

        // Local Vue object
        let vue_this = this;

        // Add commands
        cmdlist.add_command(
            new Command({
                command: 'api_tokens.update',
                scope: 'local-api-tokens',
                group: 'API settings',
                title: 'Update tokens',
                icon: 'fa-arrows-rotate',
                method: () => {
                    vue_this.refreshing = true;
                    this.$store.commit('get_api_tokens', {
                        id: this.app_id,
                        force: true,
                    });
                },
            })
        );

        if (this.api_tokens == null)
            this.$store.commit('get_api_tokens', { id: this.app_id });
        else this.refreshing = false;
    },
    beforeUnmount() {
        this.eventbus.off('get_api_tokens_done', this.stop_refreshing);
        this.eventbus.off('remove_api_token', this.action_remove);
        cmdlist.remove_command_scope('local-api-tokens');
    },
    methods: {
        stop_refreshing() {
            this.refreshing = false;
            this.tokens_loaded = true;
            this.reloader = !this.reloader;
        },
        action_refresh() {
            cmdlist.execute('api_tokens.update');
        },
        remove_tokens(tokens) {
            // Local this
            let vue_this = this;

            this.api_tokens.forEach((e) => {
                if (
                    tokens.indexOf(e.id.toString()) != -1 ||
                    tokens.indexOf(e.id) != -1
                )
                    this.eventbus.emit('api_tokens_set_loading', e.id);
            });

            // Delete the user sessions
            this.$store.commit('delete_api_tokens', {
                api_token_ids: tokens,
                client_id: this.app_id,
                done: (data) => {
                    vue_this.reloader = !this.reloader;
                    tokens.forEach((token) => {
                        // Emit a event to remove it from the 'selected' list
                        vue_this.eventbus.emit(
                            'card_list_changed_api_settings_tokens',
                            {
                                action: 'change_selection',
                                id: `token_id_${token}`,
                                type: 'remove',
                            }
                        );
                    });
                },
                error: (error) => {
                    vue_this.api_tokens.forEach((e) => {
                        if (
                            tokens.indexOf(e.id.toString()) != -1 ||
                            tokens.indexOf(e.id) != -1
                        )
                            vue_this.eventbus.emit(
                                'api_tokens_set_loading',
                                e.id
                            );
                    });
                },
            });
        },
        action_remove(id) {
            this.remove_tokens([+id]);
        },
        action_remove_selected() {
            // Get all ID's of selected elements
            let selected = new Array();
            this.$refs.list.selected.forEach((element) => {
                element = element.replace('token_id_', '');
                selected.push(+element);
            });

            // Remove the elements
            this.remove_tokens(selected);
        },
    },
};
</script>