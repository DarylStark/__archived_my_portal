<template>
    <Grid>
        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
        <Cell cols="8">
            <SectionTitle>Account settings</SectionTitle>
        </Cell>
        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>

        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
        <Cell cols="8">
            <Card no_padding class="settings">
                <TextSetting
                    icon="fa-user-circle"
                    setting_type="account"
                    setting="fullname"
                    validate_re="^[A-Za-z0-9\- ]+$"
                    >Full name</TextSetting
                >
                <TextSetting
                    icon="fa-user"
                    setting_type="account"
                    setting="username"
                    validate_re="^[A-Za-z][A-Za-z0-9\-_.]+$"
                    >Username</TextSetting
                >
                <TextSetting
                    icon="fa-at"
                    setting_type="account"
                    setting="email"
                    validate_re="^[a-z0-9_\-.]+@[a-z.-]+\.[a-z.]+$"
                    >E-mail address</TextSetting
                >
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
            <Card no_padding no_border_bottom class="settings">
                <LabelSetting icon="fa-lock" v-on:click="open_update_password">
                    Password
                    <template v-slot:label>{{ password_date }}</template>
                </LabelSetting>
                <div class="block" v-if="password_edit">PW EDIT</div>
                <LabelSetting icon="fa-key" v-on:click="open_update_tfa">
                    Two-factor authentication
                    <template v-slot:label>Disabled</template>
                </LabelSetting>
                <div class="block" v-if="tfa_edit">2FA EDIT</div>
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
import TextSetting from './TextSetting.vue';
import LabelSetting from './LabelSetting.vue';
import DateTime from '../../my/datetime';

export default {
    name: 'Settings',
    components: {
        Grid,
        Cell,
        Card,
        SectionTitle,
        TextSetting,
        LabelSetting,
    },
    data() {
        return {
            password_edit: false,
            tfa_edit: false,
        };
    },
    created() {
        this.$store.commit('sidebar_available_set', true);
    },
    computed: {
        password_date() {
            let dt = new DateTime(
                this.$store.state.user_session.session.account['password_date']
            );
            let changed = dt.days_ago();
            let changed_text = `${changed} days ago`;
            if (changed == 0) {
                changed_text = 'today';
            } else if (changed == 1) {
                changed_text = 'yesterday';
            }
            return `Changed ${changed_text}`;
        },
    },
    methods: {
        open_update_password() {
            this.password_edit = !this.password_edit;
        },
        open_update_tfa() {
            this.tfa_edit = !this.tfa_edit;
        },
    },
};
</script>
