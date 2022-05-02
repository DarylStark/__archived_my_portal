<template>
    <Grid>
        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
        <Cell cols="8">
            <SectionTitle>Account settings</SectionTitle>
        </Cell>
        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>

        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
        <Cell cols="8">
            <Card no_padding>
                <div class="settings">
                    <Setting
                        icon="fa-user-circle"
                        setting_type="account"
                        setting="fullname"
                        validate_re="^[A-Za-z0-9\- ]+$"
                        >Full name</Setting
                    >
                    <Setting
                        icon="fa-user"
                        setting_type="account"
                        setting="username"
                        validate_re="^[A-Za-z][A-Za-z0-9\-_.]+$"
                        >Username</Setting
                    >
                    <Setting
                        icon="fa-at"
                        setting_type="account"
                        setting="email"
                        validate_re="^[a-z0-9_\-.]+@[a-z.-]+\.[a-z.]+$"
                        >E-mail address</Setting
                    >
                </div>
            </Card>
        </Cell>
        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>

        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
        <Cell cols="8">
            <SectionTitle>Security</SectionTitle>
        </Cell>
        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>

        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
        <Cell cols="8">
            <Card no_padding>
                <div class="settings">
                    <Setting
                        icon="fa-key"
                        setting_type="account"
                        setting="password"
                        >Password</Setting
                    >
                </div>
            </Card>
        </Cell>
        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>

        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
        <Cell cols="8">
            <SectionTitle>User Sessions</SectionTitle>
        </Cell>
        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>

        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
        <Cell cols="8">
            <Card>Hier komen de user sessies</Card>
        </Cell>
        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
    </Grid>
</template>

<script>
import Grid from '../../layout/Grid/Grid';
import Cell from '../../layout/Grid/Cell';
import Card from '../../cards/Card';
import SectionTitle from '../../layout/Titles/SectionTitle.vue';
import Setting from './Setting.vue';

export default {
    name: 'Settings',
    components: {
        Grid,
        Cell,
        Card,
        SectionTitle,
        Setting,
    },
    created() {
        this.$store.commit('sidebar_available_set', true);
    },
};
</script>
