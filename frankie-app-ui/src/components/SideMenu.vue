<script lang="ts">
export default {
  data() {
    return {
      pages: ["main", "stats"],
    };
  },
};
</script>

<template>
  <span class="open-menu">Ｘ</span>
  <div class="side-menu">
    <ul>
      <li v-for="page of pages" :key="page">
        <a :href="'/' + page">{{ page }}</a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.side-menu {
  display: flex;
  flex-flow: column;
  width: 0;
  position: fixed;
  overflow-x: hidden;
}

ul {
  list-style-type: none;
}
</style>
