<template>
    <div class="header">
        <MenuToggle></MenuToggle>
        <Spacer></Spacer>
        <SidebarToggle></SidebarToggle>
        <UserMenu></UserMenu>
    </div>
</template>

<script>
import MenuToggle from './MenuToggle.vue';
import Spacer from '../../components/Spacer.vue';
import UserMenu from './UserMenu.vue';
import SidebarToggle from './SidebarToggle.vue';

export default {
    name: 'Header',
    components: { MenuToggle, Spacer, UserMenu, SidebarToggle },
};
</script>
