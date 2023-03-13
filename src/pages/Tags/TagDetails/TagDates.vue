<template>
    <div class="tag_dates">
        <Card no_padding>
            <MonthCalendar
                v-bind:select="select_date"
                v-if="!loading"
                v-bind:highlight="selected_dates"
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
    computed: {
        loading() {
            return (
                this.$store.state.api_data.tags_dates_tag_ids.indexOf(
                    this.tag.id
                ) == -1
            );
        },
        selected_dates() {
            let filtered_dates = this.$store.state.api_data.tags_dates.filter(
                (date_tag) => date_tag.tag_id == this.tag.id
            );
            let return_value = new Array();
            filtered_dates.forEach((date) => {
                date = new Date(date.date);
                return_value.push(date);
            });
            return return_value;
        },
    },
    created() {
        this.$store.commit('get_dates_for_tag', {
            tag_id: this.tag.id,
        });
    },
    methods: {
        select_date(date) {
            console.warn('Selected date');
        },
    },
};
</script>