<template>
    <div class="api_tokens_loading">
        <div class="icon">
            <i class="fas fa-spinner spin"></i>
        </div>
        <div class="text">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TokensLoading',
};
</script>
