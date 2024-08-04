// src/stores/scroll.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useScrollStore = defineStore('scroll', () => {
  const scrollPosition = ref(0);

  const setScrollPosition = (position: number) => {
    scrollPosition.value = position;
  };

  const getScrollPosition = () => {
    return scrollPosition.value;
  };

  return {
    scrollPosition,
    setScrollPosition,
    getScrollPosition,
  };
});
