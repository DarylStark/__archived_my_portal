<template>
    <Card no_padding no_border_bottom class="settings">
        <ToggleSetting
            setting_type="ui"
            setting="warn_on_unnamed_session"
            icon="fa-at"
            >Warning for unnamed sessions</ToggleSetting
        >
        <DropdownSetting icon="fa-adjust" setting="theme" setting_type="ui">
            Theme
        </DropdownSetting>
    </Card>
</template>

<script>
import Card from '../../cards/Card';
import DropdownSetting from './DropdownSetting.vue';
import ToggleSetting from './ToggleSetting';

export default {
    name: 'UISettings',
    components: {
        Card,
        DropdownSetting,
        ToggleSetting,
    },
};
</script>