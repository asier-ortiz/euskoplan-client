<template>
  <div class="social-share-buttons">
    <button class="sharer button"
            data-sharer="facebook"
            :data-url="shareUrl"
            :data-title="shareTitle"
            :data-description="shareDescription">
      <font-awesome-icon :icon="['fab', 'facebook-f']" />
    </button>
    <button class="sharer button"
            data-sharer="twitter"
            :data-url="shareUrl"
            :data-title="shareTitle"
            :data-hashtags="shareHashtags">
      <font-awesome-icon :icon="['fab', 'twitter']" />
    </button>
    <button class="sharer button"
            data-sharer="whatsapp"
            :data-url="shareUrl"
            :data-title="shareTitle"
            :data-text="shareDescription">
      <font-awesome-icon :icon="['fab', 'whatsapp']" />
    </button>
    <button class="sharer button"
            data-sharer="telegram"
            :data-url="shareUrl"
            :data-title="shareTitle"
            :data-text="shareDescription">
      <font-awesome-icon :icon="['fab', 'telegram-plane']" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps<{
  resource: {
    nombre?: string;
    descripcion?: string;
    imagenes?: { fuente: string, titulo?: string }[];
  };
}>();

const shareUrl = ref(window.location.href);

const shareTitle = computed(() => {
  const imageTitle = props.resource.imagenes && props.resource.imagenes[0]?.titulo
    ? ` - ${props.resource.imagenes[0].titulo}`
    : '';
  return (props.resource.nombre || 'Recurso interesante') + imageTitle;
});

const shareDescription = computed(() => {
  return props.resource.descripcion
    ? `${props.resource.descripcion}`
    : 'Descubre más sobre este recurso en Euskoplan.';
});

const shareHashtags = ref('Euskoplan,Euskadi,Turismo');

onMounted(() => {
  if (typeof window.Sharer !== 'undefined') {
    window.Sharer.init();
  }
});
</script>

<style scoped>
.social-share-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sharer.button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 36px;
  margin-right: 15px;
  color: #000;
  transition: color 0.3s ease;
}

.sharer.button:hover {
  color: #007bff;
}

.sharer.button i,
.sharer.button svg {
  font-size: 36px;
  width: 24px;
  height: 24px;
  pointer-events: none;
}

@media (max-width: 900px) {

  .sharer.button:not(:last-child) {
    margin-right: 32px;
  }
  .sharer.button {
    margin-right: 0px;
    margin-top: 16px;
  }

  .social-share-buttons {
    flex-direction: row;
    justify-content: center;
    margin-top: 10px;
    gap: 10px;
  }
}
</style>
