<template>
    <div>
        <form v-on:submit.prevent="save" v-if="token == null">
            <Card v-if="action == 'authorize'">
                <template v-slot:title>
                    {{ application.app_name }} requests your authorization
                </template>
                The application <b>{{ application.app_name }}</b> by
                <b>{{ application.app_publisher }}</b> would like to access your
                account and requests your permission to do so. It requests
                permissions to following scopes:
            </Card>
            <Card v-if="action == 'add_permissions'">
                <template v-slot:title>
                    {{ application.app_name }} requests extra permissions
                </template>
                The application <b>{{ application.app_name }}</b> by
                <b>{{ application.app_publisher }}</b> would like to access
                extra scopes on your behalf:
            </Card>

            <CardList id="permissions" ref="list">
                <CardListItem
                    v-for="scope in scopes"
                    v-bind:key="scope"
                    v-bind:id="scope"
                    list_id="permissions"
                    v-bind:checkbox="true"
                    v-bind:checked="true"
                    v-bind:content_as_label="true"
                    v-bind:checkbox_disabled="saving"
                >
                    <div>
                        <b>{{ get_scope_name(scope).group }}: </b>
                        {{ get_scope_name(scope).scope }}
                    </div>
                </CardListItem>
            </CardList>
            <Card v-if="action == 'authorize'">
                <p>
                    If you want to grant
                    <b>{{ application.app_name }}</b> access to your account,
                    check the scopes that you want to give it permissions to and
                    click on <b>Save</b>. If you don't want to give
                    <b>{{ application.app_name }}</b> your permissions, you can
                    just close this page without saving.
                </p>
                <p>
                    Keep in mind that you can revoke scopes after allowing them.
                </p>
            </Card>
            <Card>
                <Input
                    id="title"
                    ref="title"
                    icon="fas fa-user"
                    placeholder="Title for this token (optional)"
                    v-model="title"
                    v-bind:disabled="saving"
                    v-if="action == 'authorize'"
                >
                </Input>
                <p v-if="action == 'add_permissions'">
                    Keep in mind that you can revoke scopes after allowing them.
                </p>
                <template v-slot:actions>
                    <Button
                        type="submit"
                        icon="fa fa-key"
                        v-bind:loading="save_loading"
                        v-bind:disabled="save_disabled"
                        >Save</Button
                    >
                </template>
            </Card>
        </form>
        <Card v-if="token != null && action == 'authorize'">
            <p>
                The authorization is given to <b>{{ application.app_name }}</b
                >! To use the authorization, the application needs a unique
                token. This token is displayed below. Warning: do not give this
                token to untrusted sources! The token is only displayed once, so
                save it.
            </p>
            <Code block>{{ token }}</Code>
        </Card>
        <Card v-if="token != null && action == 'add_permissions'">
            <p>
                The new scopes are added to this API token! The application
                doesn't have to do anything. The new permissions are now
                available.
            </p>
        </Card>
    </div>
</template>

<script>
import api from '../my/api';
import APICommand from '../my/api_command';
import Card from '../cards/Card';
import CardList from '../cards/CardList';
import CardListItem from '../cards/CardListItem';
import Button from '../components/Button';
import Input from '../components/Input';
import Code from '../components/Code';
import { get_scope_name } from '../my/oauth_scopes';

export default {
    name: 'Authorize',
    components: {
        Card,
        CardList,
        CardListItem,
        Button,
        Input,
        Code,
    },
    props: {
        application: {
            type: Object,
            required: false,
        },
        scopes: {
            type: Array,
            required: true,
        },
        app_identifier: {
            type: String,
            required: false,
        },
        action: {
            type: String,
            required: true,
        },
        api_token: {
            type: String,
            required: false,
        },
    },
    data() {
        return {
            saving: false,
            selection: 1,
            title: null,
            token: null,
        };
    },
    created() {
        this.eventbus.on('card_list_changed_permissions', (event) => {
            this.$nextTick(() => {
                if (this.$refs.list) {
                    if (this.$refs.list.selected.length == 0)
                        this.selection = null;
                    else this.selection = this.$refs.list.selected.length;
                }
            });
        });
    },
    mounted() {
        if (this.action == 'authorize') this.$refs.title.focus();
    },
    computed: {
        save_disabled() {
            if (this.saving) return true;
            if (this.selection == null) return true;
            return false;
        },
        save_loading() {
            if (this.saving) return true;
            return false;
        },
    },
    methods: {
        get_scope_name(scope_name) {
            // This function is defined in `../my/oauth_scopes`, but VueJS
            // can only used methods in the template that are defined in the
            // methods key of the VueJS object. That's why we use this as a
            // project object
            return get_scope_name(scope_name);
        },
        save(event) {
            if (this.action == 'authorize') this.save_authorize();
            if (this.action == 'add_permissions') this.save_add_permissions();
        },
        save_authorize() {
            // Set a new 'this' to use in the callbacks
            let vue_this = this;

            // Make sure everything is disabled
            this.saving = true;

            // Create the API token
            api.execute(
                new APICommand(
                    'api_tokens',
                    'create',
                    'POST',
                    {
                        title: this.title == null ? '' : this.title,
                        app_token: this.application.token,
                        scopes: this.$refs.list.selected,
                    },
                    (data) => {
                        // Done! We have the data
                        if (this.application.redirect_url) {
                            let url = this.application.redirect_url;
                            url = url.replace('{{ token }}', data.data.token);
                            url = url.replace(
                                '{{ reference }}',
                                this.app_identifier
                            );
                            url = url.replace('{{ action }}', 'authorize');
                            location.href = url;
                        } else {
                            vue_this.saving = false;
                            vue_this.token = data.data.token;
                        }
                    },
                    (error) => {
                        console.log(error);
                        // TODO: Give error
                        vue_this.saving = false;
                    }
                )
            );
        },
        save_add_permissions() {
            // Set a new 'this' to use in the callbacks
            let vue_this = this;

            // Make sure everything is disabled
            this.saving = true;

            // Create the API token
            api.execute(
                new APICommand(
                    'api_tokens',
                    'add_permissions',
                    'PATCH',
                    {
                        api_token: this.api_token,
                        scopes: this.$refs.list.selected,
                    },
                    (data) => {
                        // Done! We have the data
                        if (this.application.redirect_url) {
                            let url = this.application.redirect_url;
                            url = url.replace('{{ token }}', this.api_token);
                            url = url.replace(
                                '{{ reference }}',
                                this.app_identifier
                            );
                            url = url.replace(
                                '{{ action }}',
                                'add_permissions'
                            );
                            location.href = url;
                        } else {
                            // Display a message that it's done
                            vue_this.saving = false;
                            vue_this.token = '<>';
                        }
                    },
                    (error) => {
                        console.log(error);
                        // TODO: Give error
                        vue_this.saving = false;
                    }
                )
            );
        },
    },
};
</script>
