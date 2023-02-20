<template>
    <div>
        <!-- TODO: Make this a component -->
        <div v-if="action == 'loading'">LOADING</div>

        <!-- Authorization form -->
        <Authorize
            v-if="action == 'authorize'"
            v-bind:application="application"
            v-bind:scopes="scopes"
            v-bind:app_identifier="app_identifier"
        ></Authorize>
    </div>
</template>

<script>
import api from '../my/api.js';
import APICommand from '../my/api_command.js';
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
            scopes: null,
            app_identifier: null,
        };
    },
    mounted() {
        // List of possible actions
        const possible_actions = ['authorize'];

        // Get the action from the URL parameters
        let url = new URL(location.href);
        let action = url.searchParams.get('action');
        this.app_identifier = url.searchParams.get('reference');

        if (possible_actions.indexOf(action) == -1) {
            // If the action is something that we cannot explain, we stop the
            // script here; nothing more to do
            console.error(`The action "${action}" is not a valid action!`);
            this.action = 'error';
            return;
        }

        // TODO: Get the application details from backend
        const app_token = url.searchParams.get('token');
        const scopes = url.searchParams.get('scopes').split(',');

        if (
            app_token == null ||
            app_token == '' ||
            scopes == null ||
            scopes == ''
        ) {
            this.action = 'error';
            return;
        }

        // Set a new 'this' to use in the callbacks
        let vue_this = this;

        // Get the application details
        api.execute(
            new APICommand(
                'api_clients',
                'all/' + app_token,
                'GET',
                null,
                function (data) {
                    // We got the details! Save them
                    if (data.data.length == 0) {
                        // No data, not a valid token
                        vue_this.action = 'error';
                        return;
                    }
                    vue_this.application = data.data;
                    vue_this.scopes = scopes;
                    vue_this.action = action;
                },
                function (error) {
                    // TODO: ERROR
                    vue_this.action = 'error';
                }
            )
        );

        // Set the correct action
    },
};
</script>
