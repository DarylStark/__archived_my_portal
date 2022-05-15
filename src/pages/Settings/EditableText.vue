<template>
    <div>
        <template v-if="value != null">
            {{ value }}
        </template>
        <div v-if="value == null" class="empty">
            {{ empty_text }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'EditableText',
    props: {
        value: {},
        empty_text: {},
    },
};
</script>