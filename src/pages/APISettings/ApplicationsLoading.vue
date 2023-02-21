<template>
    <div class="api_settings_loading">
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
    name: 'ApplicationsLoading',
};
</script>
