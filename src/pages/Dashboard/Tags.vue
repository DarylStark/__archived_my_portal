<template>
    <Card no_padding>
        <div v-if="!tags_loaded" class="loading_tags">
            <div><i class="fas fa-spinner spin"></i></div>
            <div>Loading tags</div>
        </div>
        <div class="tags" v-if="tags_loaded && tags.length > 0">
            <TagButton
                v-for="tag in tags"
                v-bind:tag="tag"
                v-bind:key="tag"
                v-bind:delete_method="delete_tag"
            ></TagButton>
        </div>
        <div class="empty_tags" v-if="tags_loaded && tags.length == 0">
            This day has no tags yet
        </div>
        <button v-on:click="add_tag" v-if="tags">add tag</button>
    </Card>
</template>

<script>
import Card from '../../cards/Card.vue';
import TagButton from '../../components/TagButton.vue';

export default {
    name: 'Tags',
    components: {
        Card,
        TagButton,
    },
    props: {
        date: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            tags_loaded: false,
        };
    },
    watch: {
        date: function (new_value, old_value) {
            this.update_tags();
        },
    },
    computed: {
        tags() {
            if (this.$store.state.api_data.tags) {
                if (this.tags_loaded) {
                    console.log(this.$store.state.api_data.dashboard_tags);

                    // Extract all tag IDs from the source
                    const tag_ids = this.$store.state.api_data.dashboard_tags[
                        this.date
                    ].map((e) => e.tag_id);

                    // Create a array with all relevant tag objects
                    const tag_list = this.$store.state.api_data.tags.filter(
                        (tag) => tag_ids.indexOf(tag.id) >= 0
                    );

                    // Return the created array
                    return tag_list;
                }
            }
            return new Array();
        },
    },
    created() {
        this.update_tags();
    },
    methods: {
        update_tags() {
            let vue_this = this;
            this.tags_loaded = false;
            this.$store.commit('update_tags_for_date', {
                date: this.date,
                done: (data) => {
                    vue_this.tags_loaded = true;
                },
            });
        },
        delete_tag(tag) {
            // Method to delete a tag from this specific day
            this.$store.commit('untag_date', {
                date: this.date,
                tag_id: tag.id,
            });
        },
        add_tag() {
            // Method to add a tag to this specific day
            this.$store.commit('tag_date', {
                date: this.date,
                tag_id: 1,
            });
        },
    },
};
</script>