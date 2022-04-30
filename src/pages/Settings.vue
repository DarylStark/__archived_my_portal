<template>
    <Grid> </Grid>
</template>

<script>
import Grid from '../layout/Grid/Grid';
import Cell from '../layout/Grid/Cell';

export default {
    name: 'Settings',
    components: {
        Grid,
        Cell,
    },
    created() {
        this.$store.commit('sidebar_available_set', false);
    },
};
</script>
