<template>
    <CardList
        id="api_applications"
        v-bind:loading="api_clients == null"
        ref="list"
    >
        <template v-slot:headers>
            <div>Application</div>
        </template>

        <ApplicationsLoading v-if="api_clients == null">
            Loading the API applications
        </ApplicationsLoading>
        <CardListEmpty v-if="count == 0">
            There are no API applications defined
        </CardListEmpty>

        <template v-if="count > 0">
            <Application
                v-for="client in api_clients"
                v-bind:key="client.id"
                v-bind:client="client"
            ></Application>
        </template>

        <template v-slot:actions_selected>
            <CardListAction
                list_id="api_applications"
                icon="fa-trash"
                v-bind:action="action_remove_selected"
                confirm_first
            ></CardListAction>
        </template>
        <template v-slot:actions>
            <CardListAction
                list_id="api_applications"
                icon="fa-arrows-rotate"
                v-bind:action="action_refresh"
                v-bind:loading="refreshing"
            ></CardListAction>
        </template>
    </CardList>
</template>

<script>
import Application from './Application.vue';
import ApplicationsLoading from './ApplicationsLoading.vue';
import CardList from '../../cards/CardList';
import CardListAction from '../../cards/CardListAction';
import CardListEmpty from '../../cards/CardListEmpty';
import cmdlist from '../../my/command_list';
import Command from '../../my/command';

export default {
    name: 'Applications',
    components: {
        Application,
        CardList,
        CardListAction,
        CardListEmpty,
        ApplicationsLoading,
    },
    computed: {
        api_clients() {
            if (this.$store.state.api_data.api_clients)
                return this.$store.state.api_data.api_clients.sort(
                    (first, second) => {
                        if (first.app_name > second.app_name) return 1;
                        return -1;
                    }
                );
            return null;
        },
        count() {
            if (this.api_clients != null) return this.api_clients.length;
            return -1;
        },
    },
    data() {
        return {
            refreshing: true,
        };
    },
    created() {
        // TODO: Add a command to the palette to delete items.
        // Example: Tags-page. Same goes for refreshing the
        // loaded applications.

        // Load the user sessions from the API
        if (this.api_clients == null)
            this.$store.commit('get_api_clients', { force: false });
        else this.refreshing = false;

        // Local Vue object
        let vue_this = this;

        // Add commands
        cmdlist.add_command(
            new Command({
                command: 'api_clients.update',
                scope: 'local-api-clients',
                group: 'API applications',
                title: 'Update',
                icon: 'fa-arrows-rotate',
                method: () => {
                    vue_this.refreshing = true;
                    this.$store.commit('get_api_clients', { force: true });
                },
            })
        );

        // Event handler for the loading of API clients
        this.eventbus.on('get_api_clients_done', this.stop_refreshing);

        // Event handler for removing individual sessions
        this.eventbus.on('remove_api_client', this.action_remove);
    },
    unmounted() {
        this.eventbus.off('get_api_clients_done', this.stop_refreshing);
        this.eventbus.off('remove_api_client', this.action_remove);
        cmdlist.remove_command_scope('local-api-clients');
    },
    methods: {
        stop_refreshing() {
            this.refreshing = false;
        },
        remove_clients(clients) {
            // Delete the user sessions
            this.$store.commit('delete_api_clients', {
                clients: clients,
                done: (data) => {
                    clients.forEach((client) => {
                        // Emit a event to remove it from the 'selected' list
                        this.eventbus.emit(
                            'card_list_changed_api_applications',
                            {
                                action: 'change_selection',
                                id: `application_id_${client}`,
                                type: 'remove',
                            }
                        );
                    });
                },
            });
        },
        action_refresh() {
            cmdlist.execute('api_clients.update');
        },
        action_remove(id) {
            this.remove_clients([+id]);
        },
        action_remove_selected() {
            // Get all ID's of selected elements
            let selected = new Array();
            this.$refs.list.selected.forEach((element) => {
                element = element.replace('application_id_', '');
                selected.push(+element);
            });

            // Remove the elements
            this.remove_clients(selected);
        },
    },
};
</script>
