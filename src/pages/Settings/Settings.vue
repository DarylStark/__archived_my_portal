<template>
    <Grid>
        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
        <Cell cols="8">
            <SectionTitle>Account</SectionTitle>
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
            <SectionTitle>Account security</SectionTitle>
        </Cell>
        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>

        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
        <Cell cols="8">
            <Card no_padding no_border_bottom class="settings">
                <Setting
                    icon="fa-lock"
                    v-on:click="open_update_password"
                    v-bind:saving="password_saving"
                >
                    Password
                    <template v-slot:value>{{ password_date }}</template>
                </Setting>
                <div class="block" v-show="password_edit">
                    <PasswordChanger ref="password_changer"></PasswordChanger>
                </div>
                <Setting icon="fa-key" v-on:click="open_update_tfa">
                    Two-factor authentication
                    <template v-slot:value>Disabled</template>
                </Setting>
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
import Setting from './Setting.vue';
import DateTime from '../../my/datetime';
import PasswordChanger from './PasswordChanger';

export default {
    name: 'Settings',
    components: {
        Grid,
        Cell,
        Card,
        SectionTitle,
        TextSetting,
        Setting,
        PasswordChanger,
    },
    data() {
        return {
            password_edit: false,
            password_saving: false,
            tfa_edit: false,
        };
    },
    created() {
        this.$store.commit('sidebar_available_set', true);
        this.eventbus.on('changing_password', () => {
            this.password_saving = true;
        });
        this.eventbus.on('changed_password', (success) => {
            this.password_saving = false;
            if (success) {
                this.password_edit = false;
                this.$refs.password_changer.reset();
            }
        });
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
            if (this.password_edit) {
                this.$nextTick(() => this.$refs.password_changer.focus());
            }
        },
        open_update_tfa() {
            this.tfa_edit = !this.tfa_edit;
        },
    },
};
</script>
