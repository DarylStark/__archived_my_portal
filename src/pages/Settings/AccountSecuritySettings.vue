<template>
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
        <Setting
            icon="fa-key"
            v-on:click="open_update_tfa"
            v-bind:saving="tfa_saving"
        >
            Two-factor authentication
            <template v-slot:value>
                <template v-if="tfa_enabled">Enabled</template>
                <template v-if="!tfa_enabled">Disabled</template>
            </template>
        </Setting>

        <div class="block" v-if="tfa_edit && !tfa_enabled">
            <Enable2FA></Enable2FA>
        </div>
        <div class="block" v-if="tfa_edit && tfa_enabled">
            <Disable2FA></Disable2FA>
        </div>
    </Card>
</template>

<script>
import Card from '../../cards/Card';
import Setting from './Setting.vue';
import PasswordChanger from './PasswordChanger';
import Enable2FA from './Enable2FA.vue';
import Disable2FA from './Disable2FA.vue';
import DateTime from '../../my/datetime';

export default {
    name: 'AccountSecuritySettings.vue',
    components: {
        Card,
        Setting,
        PasswordChanger,
        Enable2FA,
        Disable2FA,
    },
    data() {
        return {
            password_edit: false,
            password_saving: false,
            tfa_edit: false,
            tfa_saving: false,
        };
    },
    created() {
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
        this.eventbus.on('second_factor_setting', () => {
            this.tfa_saving = true;
        });
        this.eventbus.on('second_factor_set', (success) => {
            this.tfa_saving = false;
            if (success) {
                this.tfa_edit = false;
            }
        });

        this.eventbus.on('second_factor_disabled', (success) => {
            this.tfa_saving = false;
            if (success) {
                this.tfa_edit = false;
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
        tfa_enabled() {
            return this.$store.state.user_session.session.account.second_factor;
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