<template>
    <Grid class="api_settings_details">
        <!-- TODO: Make this pretty -->

        <Cell cols="12">
            <SectionTitle v-if="!loading">{{
                application.app_name
            }}</SectionTitle>
            <SectionTitle v-if="loading">Loading</SectionTitle>
        </Cell>

        <!-- TODO: Seperate component -->

        <Cell cols="12">
            <CardList
                id="application_details"
                v-bind:checkbox="false"
                class="app_details"
            >
                <template v-slot:headers>
                    <div>Application details</div>
                </template>

                <ApplicationsLoading v-if="loading">
                    Loading the API application details
                </ApplicationsLoading>

                <template v-if="!loading">
                    <CardListItem
                        id="creation_datetime"
                        list_id="application_details"
                        v-bind:checkbox="false"
                        v-bind:loading="true"
                    >
                        <div class="details_left">Created on</div>
                        <div class="details_right">
                            <DateTimeView
                                v-bind:datetime="application.created"
                            ></DateTimeView>
                        </div>
                    </CardListItem>

                    <CardListItem
                        id="app_name"
                        list_id="application_details"
                        v-bind:checkbox="false"
                        v-bind:loading="true"
                    >
                        <div class="details_left">Application name</div>
                        <div class="details_right">
                            <EditableText
                                v-bind:value="application.app_name"
                                empty_text="No name"
                                v-bind:id="get_id('app_name')"
                                v-bind:done="save_name"
                                validate_re="^[a-zA-Z][a-zA-Z0-9\ \-]+$"
                                ref="editabletext_app_name"
                                v-bind:disabled="application.loading"
                            >
                            </EditableText>
                        </div>
                    </CardListItem>

                    <CardListItem
                        id="app_publisher"
                        list_id="application_details"
                        v-bind:checkbox="false"
                    >
                        <div class="details_left">Publisher</div>
                        <div class="details_right">
                            <EditableText
                                v-bind:value="application.app_publisher"
                                empty_text="No publisher"
                                v-bind:id="get_id('app_publisher')"
                                v-bind:done="save_publisher"
                                validate_re="^[a-zA-Z][a-zA-Z0-9\ \-]+$"
                                ref="editabletext_app_publisher"
                                v-bind:disabled="application.loading"
                            >
                            </EditableText>
                        </div>
                    </CardListItem>

                    <CardListItem
                        id="redirect_url"
                        list_id="application_details"
                        v-bind:checkbox="false"
                    >
                        <div class="details_left">Redirect URL</div>
                        <div class="details_right">
                            <EditableText
                                v-bind:value="application.redirect_url"
                                empty_text="No redirect URL set"
                                v-bind:id="get_id('redirect_url')"
                                v-bind:done="save_redirect_url"
                                ref="editabletext_redirect_url"
                                v-bind:disabled="application.loading"
                            >
                            </EditableText>
                        </div>
                    </CardListItem>

                    <CardListItem
                        id="enabled"
                        list_id="application_details"
                        v-bind:checkbox="false"
                    >
                        <div class="details_left">Status</div>
                        <div class="details_right">
                            <Label
                                class="red"
                                v-bind:click_action="enable"
                                v-bind:loading="saving_enabled"
                                v-if="!application.enabled"
                                >Disabled - click to enable</Label
                            >
                            <Label
                                class="green"
                                v-bind:click_action="disable"
                                v-bind:loading="saving_enabled"
                                v-if="application.enabled"
                                >Enabled - click to disable</Label
                            >
                        </div>
                    </CardListItem>

                    <CardListItem
                        id="token"
                        list_id="application_details"
                        v-bind:checkbox="false"
                    >
                        <div class="details_left">Application token</div>
                        <div class="details_right">
                            <Code hidden>
                                <template v-slot:hidden_text
                                    >Click here to reveal the token</template
                                >
                                {{ application.token }}
                            </Code>
                        </div>
                    </CardListItem>
                </template>
            </CardList>

            <!-- Tokens -->

            <template v-if="!loading">
                <Cell cols="12">
                    <SectionTitle>Tokens for this app</SectionTitle>
                </Cell>
                <Tokens v-bind:app_id="application.id"></Tokens>
            </template>
        </Cell>
    </Grid>
</template>

<script>
import Grid from '../../../layout/Grid/Grid';
import Cell from '../../../layout/Grid/Cell';
import SectionTitle from '../../../layout/Titles/SectionTitle.vue';
import CardList from '../../../cards/CardList';
import CardListItem from '../../../cards/CardListItem';
import EditableText from '../../../components/EditableText';
import ApplicationsLoading from '../ApplicationsLoading';
import Code from '../../../components/Code';
import Label from '../../../components/Label';
import { get_slug_for_name } from '../../../my/generic';
import DateTimeView from '../../../components/DateTimeView.vue';
import Tokens from './Tokens';

export default {
    name: 'ApplicationDetails',
    components: {
        Grid,
        Cell,
        SectionTitle,
        CardList,
        CardListItem,
        EditableText,
        ApplicationsLoading,
        Code,
        Label,
        DateTimeView,
        Tokens,
    },
    computed: {
        application_slug() {
            return this.$route.params.application_slug;
        },
        application() {
            let app_details = null;
            if (!this.loading)
                app_details = this.$store.state.api_data.api_clients.filter(
                    (client) => client.slug == this.application_slug
                )[0];
            if (app_details) {
                this.cached_app = app_details;
                return app_details;
            }
            return this.cached_app;
        },
        loading() {
            return this.$store.state.api_data.api_clients == null;
        },
    },
    data() {
        return {
            saving_enabled: false,
            cached_app: null,
        };
    },
    created() {
        this.$store.commit('sidebar_available_set', false);

        // Update applications
        if (this.api_clients == null)
            this.$store.commit('get_api_clients', { force: false });
    },
    methods: {
        get_id(prepend) {
            return `${prepend}_${this.application.id}`;
        },
        save_name(new_name) {
            this.$store.commit('set_api_client', {
                id: this.application.id,
                app_name: new_name,
                done: (data) => {
                    this.$refs.editabletext_app_name.stop_input();
                    this.$router.replace(
                        `/api_settings/${get_slug_for_name(new_name)}`
                    );
                },
                error: (error) => {
                    this.eventbus.emit('toast_show', {
                        title: 'Error while changing name',
                        text: 'There was a error while changing the name of this application.',
                        type: 'error',
                        icon: 'fa-link',
                    });

                    this.$refs.editabletext_app_publisher.error = true;
                    this.$refs.editabletext_app_publisher.focus(true);
                },
            });
        },
        save_publisher(new_publisher) {
            this.$store.commit('set_api_client', {
                id: this.application.id,
                app_publisher: new_publisher,
                done: (data) => {
                    this.$refs.editabletext_app_publisher.stop_input();
                },
                error: (error) => {
                    this.eventbus.emit('toast_show', {
                        title: 'Error while changing publisher',
                        text: 'There was a error while changing the publisher of this application.',
                        type: 'error',
                        icon: 'fa-link',
                    });

                    this.$refs.editabletext_app_publisher.error = true;
                    this.$refs.editabletext_app_publisher.focus(true);
                },
            });
        },
        save_redirect_url(new_url) {
            this.$store.commit('set_api_client', {
                id: this.application.id,
                redirect_url: new_url,
                done: (data) => {
                    this.$refs.editabletext_redirect_url.stop_input();
                },
                error: (error) => {
                    this.eventbus.emit('toast_show', {
                        title: 'Error while changing redirect URL',
                        text: 'There was a error while changing the redirect URL of this application.',
                        type: 'error',
                        icon: 'fa-link',
                    });

                    this.$refs.editabletext_redirect_url.error = true;
                    this.$refs.editabletext_redirect_url.focus(true);
                },
            });
        },
        enable_or_disable(state) {
            // Local this
            let vue_this = this;

            this.saving_enabled = true;
            this.$store.commit('set_api_client', {
                id: this.application.id,
                enabled: state,
                done() {
                    vue_this.saving_enabled = false;
                },
                error: (error) => {
                    // TODO: Error
                    console.log(error);
                    vue_this.saving_enabled = false;
                },
            });
        },
        enable() {
            this.enable_or_disable(true);
        },
        disable() {
            this.enable_or_disable(false);
        },
    },
};
</script>
