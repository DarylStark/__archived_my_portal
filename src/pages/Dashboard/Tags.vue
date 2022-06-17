<template>
    <Card no_padding>
        <div v-if="!tags" class="loading_tags">
            <div><i class="fas fa-spinner spin"></i></div>
            <div>Loading tags</div>
        </div>
        <div class="tags" v-if="tags && tags.length > 0">
            <TagButton
                v-for="tag in tags"
                v-bind:tag="tag"
                v-bind:key="tag"
                v-bind:delete_method="delete_tag"
            ></TagButton>
        </div>
        <div class="empty_tags" v-if="tags && tags.length == 0">
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
        tags: {
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
    },
    methods: {
        delete_tag(tag) {
            // Method to delete a tag from this specific day
            console.log(tag);
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