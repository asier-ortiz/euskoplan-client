// src/utils/image.ts

// Default images by collection type
export const getDefaultImageUrl = (collection: string): string => {
  const defaultImages: Record<string, string> = {
    accommodation: '/images/default/default-accommodation.jpg',
    cave: '/images/default/default-cave.jpg',
    cultural: '/images/default/default-cultural.jpg',
    event: '/images/default/default-event.jpg',
    fair: '/images/default/default-fair.jpg',
    museum: '/images/default/default-museum.jpg',
    natural: '/images/default/default-natural.jpg',
    restaurant: '/images/default/default-restaurant.jpg',
    default: '/images/default/default-image.jpg',
  };

  return defaultImages[collection.toLowerCase()] || defaultImages.default;
};

// Image handling utility functions
import { ref } from 'vue';

export function useImageHandler(collection: string, initialImages: Array<{ fuente: string }>) {
  const imageUrl = ref('');
  const imageLoaded = ref(false);

  const setInitialImage = () => {
    if (initialImages.length > 0 && initialImages[0].fuente) {
      imageUrl.value = initialImages[0].fuente;
    } else {
      imageUrl.value = getDefaultImageUrl(collection);
    }
  };

  const handleImageLoad = () => {
    imageLoaded.value = true;
  };

  const handleImageError = () => {
    imageUrl.value = getDefaultImageUrl(collection);
    imageLoaded.value = true;
  };

  return {
    imageUrl,
    imageLoaded,
    setInitialImage,
    handleImageLoad,
    handleImageError,
  };
}
