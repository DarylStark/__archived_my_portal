<template>
    <div>
        <!-- TODO: Make this a component -->
        <div v-if="action == 'loading'">LOADING</div>

        <!-- Authorization form -->
        <Authorize
            v-if="action == 'authorize'"
            v-bind:application="application"
        ></Authorize>
    </div>
</template>

<script>
import Card from '../cards/Card';
import CardList from '../cards/CardList';
import CardListItem from '../cards/CardListItem';
import Authorize from '../oauth/Authorize';

export default {
    name: 'OAuthConsent',
    components: {
        Authorize,
    },
    data() {
        return {
            action: 'loading',
            application: null,
        };
    },
    mounted() {
        // List of possible actions
        const possible_actions = ['authorize'];

        // Get the action from the URL parameters
        let url = new URL(location.href);
        let action = url.searchParams.get('action');
        if (possible_actions.indexOf(action) == -1) {
            // If the action is something that we cannot explain, we stop the
            // script here; nothing more to do
            console.error(`The action "${action}" is not a valid action!`);
            this.action = 'error';
            return;
        }

        // TODO: Get the application details from backend
        const app_id = url.searchParams.get('app_id');
        const scopes = url.searchParams.get('scopes');

        // Set the application details
        this.application = {
            name: 'RESTbook',
            publisher: 'Tanha Kabir',
        };

        // Set the correct action
        this.action = action;
    },
};
</script>
