<template>
  <div class="header">
    <MenuToggle></MenuToggle>
    <Spacer></Spacer>
    <UserMenu></UserMenu>
  </div>
</template>

<script>
import MenuToggle from './MenuToggle.vue';
import Spacer from '../../components/Spacer.vue';
import UserMenu from './UserMenu.vue';

export default {
  name: 'Header',
  components: { MenuToggle, Spacer, UserMenu },
};
</script>
