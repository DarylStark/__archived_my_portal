<template>
    <form>
        <Card>
            <template v-slot:title>
                {{ application.app_name }} requests your authorization
            </template>
            The application <b>{{ application.app_name }}</b> by
            <b>{{ application.app_publisher }}</b> would like to access your
            account and requests your permission to do so. It requests
            permissions to following scopes:
        </Card>
        <CardList id="permissions">
            <CardListItem
                v-for="scope in scopes"
                v-bind:key="scope"
                v-bind:id="scope"
                list_id="permissions"
                v-bind:checkbox="true"
                v-bind:checked="true"
                v-bind:content_as_label="true"
            >
                <div>
                    <b>{{ get_scope_name(scope).group }}: </b>
                    {{ get_scope_name(scope).scope }}
                </div>
            </CardListItem>
        </CardList>
        <Card>
            If you want to grant <b>{{ application.app_name }}</b> access to
            your account, check the scopes that you want to give it permissions
            to and click on <b>Save</b>. If you don't want to give
            <b>{{ application.app_name }}</b> your permissions, you can just
            close this page without saving.
            <template v-slot:actions>
                <Button icon="fa fa-key" critical>Save</Button>
            </template>
        </Card>
    </form>
</template>

<script>
import Card from '../cards/Card';
import CardList from '../cards/CardList';
import CardListItem from '../cards/CardListItem';
import Button from '../components/Button';

const scope_names = {
    'api.auth': { group: 'API', scope: 'Get API token information' },
    'api.ping': { group: 'API', scope: 'Ping the API' },
    'date_tags.create': { group: 'Tags (dates)', scope: 'Tag a specific date' },
    'date_tags.delete': {
        group: 'Tags (dates)',
        scope: 'Untag a specific date',
    },
    'date_tags.retrieve': {
        group: 'Tags (dates)',
        scope: 'Get tags for a specific date',
    },
    'tags.create': { group: 'Tags', scope: 'Create tags' },
    'tags.delete': {
        group: 'Tags',
        scope: 'Delete tags',
    },
    'tags.retrieve': {
        group: 'Tags',
        scope: 'Retrieve tags',
    },
    'tags.update': {
        group: 'Tags',
        scope: 'Update tags',
    },
    'users.create': { group: 'Users', scope: 'Create users (admin only)' },
    'users.delete': {
        group: 'Users',
        scope: 'Delete users (admin only)',
    },
    'users.retrieve': {
        group: 'Users',
        scope: 'Retrieve users (admin only)',
    },
    'users.update': {
        group: 'Users',
        scope: 'Update users (admin only)',
    },
};

export default {
    name: 'Authorize',
    components: {
        Card,
        CardList,
        CardListItem,
        Button,
    },
    props: {
        application: {
            type: Object,
            required: true,
        },
        scopes: {
            type: Array,
            required: true,
        },
    },
    methods: {
        get_scope_name(scope_name) {
            if (scope_name in scope_names) return scope_names[scope_name];
            return {
                group: 'Unknown',
                scope: scope_name,
            };
        },
    },
};
</script>
