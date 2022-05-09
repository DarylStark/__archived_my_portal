<template>
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
</template>

<script>
import Card from '../../cards/Card';
import TextSetting from './TextSetting.vue';

export default {
    name: 'AccountSettings.vue',
    components: {
        Card,
        TextSetting,
    },
};
</script>