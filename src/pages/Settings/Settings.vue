<template>
    <Grid>
        <!-- Account settings -->

        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
        <Cell cols="8">
            <SectionTitle>Account</SectionTitle>
        </Cell>
        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>

        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
        <Cell cols="8">
            <AccountSettings></AccountSettings>
        </Cell>
        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>

        <!-- Account settings -->

        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
        <Cell cols="8">
            <SectionTitle>Account security</SectionTitle>
        </Cell>
        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>

        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
        <Cell cols="8">
            <AccountSecuritySettings></AccountSecuritySettings>
        </Cell>
        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>

        <!-- User Sessions -->

        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
        <Cell cols="8">
            <SectionTitle>User Sessions</SectionTitle>
        </Cell>
        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>

        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
        <Cell cols="8">
            <UserSessions></UserSessions>
        </Cell>
        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>

        <!-- Other settings -->

        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
        <Cell cols="8">
            <SectionTitle>User Interface</SectionTitle>
        </Cell>
        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>

        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
        <Cell cols="8">
            <UISettings></UISettings>
        </Cell>
        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
    </Grid>
</template>

<script>
import Grid from '../../layout/Grid/Grid';
import Cell from '../../layout/Grid/Cell';
import SectionTitle from '../../layout/Titles/SectionTitle.vue';
import AccountSettings from './AccountSettings.vue';
import AccountSecuritySettings from './AccountSecuritySettings.vue';
import UISettings from './UISettings.vue';
import UserSessions from './UserSessions.vue';

export default {
    name: 'Settings',
    components: {
        Grid,
        Cell,
        SectionTitle,
        AccountSettings,
        AccountSecuritySettings,
        UISettings,
        UserSessions,
    },
    created() {
        this.$store.commit('sidebar_available_set', false);
    },
};
</script>
