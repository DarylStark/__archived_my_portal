<template>
    <div id="dashboard">
        <Header></Header>
        <div class="content_nav">
            <Navigation></Navigation>
            <Content></Content>
        </div>
        <Feeter></Feeter>
    </div>
</template>

<script>
import Header from '../layout/Header/Header.vue';
import Navigation from '../layout/Navigation/Navigation.vue';
import Content from '../layout/Content/Content.vue';
import Feeter from '../layout/Feeter/Feeter.vue';
import APICommand from '../my/api_command';
import api from '../my/api';

export default {
    name: 'Dashboard',
    components: { Header, Navigation, Content, Feeter },
    created: function () {
        // Set a local variable that the callsbacks can use for 'this'
        let cb_this = this;

        // Retrieve UserSession and User details
        api.execute(
            new APICommand(
                'user_sessions',
                'current',
                'GET',
                null,
                function (data) {
                    // We have the details. Let's save the user account and the
                    // session to the store for later user
                    cb_this.$store.commit('set_session', data.data);
                },
                (error) => {
                    // TODO: give error
                    console.log(error);
                }
            )
        );
    },
};
</script>
