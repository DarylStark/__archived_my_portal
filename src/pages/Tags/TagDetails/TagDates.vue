<template>
    <div class="tag_dates">
        <Card no_padding>
            <MonthCalendar
                v-bind:select="select_date"
                v-if="!loading"
                v-bind:highlight="selected_dates"
                v-bind:loading="loading_dates"
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
    data() {
        return {
            loading_dates: new Array(),
        };
    },
    methods: {
        select_date(date, selected) {
            if (selected) this.remove_date_from_tag(date);
            else this.add_date_to_tag(date);
        },
        remove_date_from_tag(original_date) {
            this.loading_dates.push(original_date.toDateString());
            let year = original_date.getFullYear();
            let month = String(original_date.getMonth() + 1).padStart(2, '0');
            let day = String(original_date.getDate()).padStart(2, '0');
            let date = `${year}-${month}-${day}`;

            this.$store.commit('untag_date', {
                date: date,
                tag_id: this.tag.id,
                done: () => {
                    this.loading_dates = this.loading_dates.filter(
                        (loading_date) =>
                            loading_date != original_date.toDateString()
                    );
                },
                error: () => {},
            });
        },
        add_date_to_tag(original_date) {
            this.loading_dates.push(original_date.toDateString());
            let year = original_date.getFullYear();
            let month = String(original_date.getMonth() + 1).padStart(2, '0');
            let day = String(original_date.getDate()).padStart(2, '0');
            let date = `${year}-${month}-${day}`;

            this.$store.commit('tag_date', {
                date: date,
                tag_id: this.tag.id,
                done: () => {
                    this.loading_dates = this.loading_dates.filter(
                        (loading_date) =>
                            loading_date != original_date.toDateString()
                    );
                },
                error: () => {},
            });
        },
    },
};
</script>