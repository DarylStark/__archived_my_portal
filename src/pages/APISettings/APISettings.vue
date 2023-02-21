<template>
    <Grid>
        <!-- Page title -->

        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
        <Cell cols="8">
            <SectionTitle>Applications</SectionTitle>
        </Cell>
        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>

        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
        <Cell cols="8">
            <Applications></Applications>
        </Cell>
        <Cell cols_desktop="2" hide_tablet hide_phone type="spacer"></Cell>
    </Grid>
</template>

<script>
import Grid from '../../layout/Grid/Grid';
import Cell from '../../layout/Grid/Cell';
import SectionTitle from '../../layout/Titles/SectionTitle.vue';
import Applications from './Applications';

export default {
    name: 'APISettings',
    components: {
        Grid,
        Cell,
        SectionTitle,
        Applications,
    },
    created() {
        this.$store.commit('sidebar_available_set', false);
    },
};
</script>
