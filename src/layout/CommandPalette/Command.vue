<template>
    <div id="command"><slot name="group"></slot>: <slot></slot></div>
</template>

<script>
export default {
    name: 'Command',
};
</script>