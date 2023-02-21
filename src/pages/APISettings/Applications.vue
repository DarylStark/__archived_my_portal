<template>
    <CardList id="api_applications" v-bind:loading="api_clients == null">
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
                v-bind:action="action_delete"
                confirm_first
            ></CardListAction>
        </template>
        <template v-slot:actions>
            <CardListAction
                list_id="api_applications"
                icon="fa-arrows-rotate"
                v-bind:action="action_refresh"
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
                return this.$store.state.api_data.api_clients;
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
        // Load the user sessions from the API
        if (this.api_clients == null)
            this.$store.commit('get_api_clients', { force: false });
        else this.refreshing = false;

        // Event handler for the loading of sessions
        this.eventbus.on('get_api_clients_done', this.stop_refreshing);
    },
    methods: {
        stop_refreshing() {
            this.refreshing = false;
        },
        action_refresh() {},
        action_delete() {},
    },
};
</script>
