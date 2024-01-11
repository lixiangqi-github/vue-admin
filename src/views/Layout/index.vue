<template>
    <div id="layout" :class="[menuStatus ? 'close' : 'open']">
        <LayoutHeader />
        <LayoutMain />
        <LayoutNav />
    </div>
</template>
<script>
import { computed } from 'vue';
import LayoutHeader from './Components/Header';
import LayoutMain from './Components/Main';
import LayoutNav from './Components/Nav';
import { useStore } from 'vuex';
export default {
    name: 'layout',
    components: { LayoutHeader, LayoutMain, LayoutNav },
    setup(props, context) {
        const store = useStore();
        const menuStatus = computed(() => store.state.isCollapse);

        return {
            menuStatus,
        }
    }
}
</script>
<style lang="scss"  scoped></style>