<template>
    <div class="tag_dates">
        <Card no_padding>
            <MonthCalendar
                v-bind:select="select_date"
                v-if="!loading"
            ></MonthCalendar>
            <TagDatesLoading v-if="loading">
                Loading the dates for this tag
            </TagDatesLoading>
        </Card>
    </div>
</template>

<script>
import Card from '../../../cards/Card.vue';
import MonthCalendar from '../../../components/MonthCalendar';
import TagDatesLoading from './TagDatesLoading.vue';

export default {
    name: 'TagDates',
    components: {
        Card,
        MonthCalendar,
        TagDatesLoading,
    },
    props: {
        tag: {
            required: true,
        },
    },
    data() {
        return {
            loading: true,
        };
    },
    created() {
        this.loading = false;
    },
    methods: {
        select_date(date) {
            console.warn('Selected date');
        },
    },
};
</script>