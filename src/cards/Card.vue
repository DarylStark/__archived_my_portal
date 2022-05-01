<template>
    <div
        v-bind:class="['card', { no_padding: no_padding }, { raised: raised }]"
    >
        <CardTitle v-bind:icon="title_icon" v-if="this.$slots['title']">
            <slot name="title"></slot>
            <template #actions v-if="this.$slots['title_actions']">
                <slot name="title_actions"></slot>
            </template>
        </CardTitle>
        <div
            v-if="!!this.$slots['default']"
            v-bind:class="[content_class ? content_class : 'content']"
        >
            <slot></slot>
        </div>
        <div class="actions" v-if="this.$slots['actions']">
            <slot name="actions"></slot>
        </div>
    </div>
</template>

<script>
import CardTitle from './CardTitle.vue';

export default {
    name: 'Card',
    components: {
        CardTitle,
    },
    props: {
        title_icon: String,
        content_class: String,
        no_padding: {
            type: Boolean,
            default: false,
        },
        raised: {
            type: Boolean,
            default: false,
        },
    },
};
</script>
