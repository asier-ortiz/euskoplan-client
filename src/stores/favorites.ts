import { defineStore } from 'pinia';
import axios from 'axios';
import Swal from 'sweetalert2';
import config from '../config'; // Import config

// Set the base URL for Axios
axios.defaults.baseURL = config.apiBaseUrl;

// Define the types for the resource and favorites
interface Resource {
  id: number;
  coleccion: string;
  [key: string]: any;
}

interface FavoriteItem {
  id: number;
  recurso: Resource;
}

interface FavoritesState {
  favorites: Record<string, FavoriteItem[]>;
  loading: boolean;
}

export const useFavoritesStore = defineStore('favorites', {
  state: (): FavoritesState => ({
    favorites: {},
    loading: false,
  }),
  actions: {
    async fetchFavorites() {
      try {
        this.loading = true;
        const response = await axios.get('/favourite'); // Use relative path
        this.favorites = response.data.favoritos || {};
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to fetch favorites.',
        });
      } finally {
        this.loading = false;
      }
    },

    async addFavorite(favoritableId: number, favoritableType: string) {
      try {
        const response = await axios.post('/favourite', {
          id_favorito: favoritableId,
          tipo_favorito: favoritableType,
        });

        if (response.status === 202) {
          Swal.fire({
            icon: 'success',
            title: 'Added!',
            text: 'Resource has been added to your favorites.',
          });

          // Refetch favorites to update the state
          this.fetchFavorites();
        }
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.response.data.error || 'Failed to add favorite.',
        });
      }
    },

    async removeFavorite(favoriteId: number) {
      try {
        const response = await axios.delete(`/favourite/${favoriteId}`);

        if (response.status === 202) {
          Swal.fire({
            icon: 'success',
            title: 'Removed!',
            text: 'Resource has been removed from your favorites.',
          });

          // Refetch favorites to update the state
          this.fetchFavorites();
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to remove favorite.',
        });
      }
    },

    isFavorite(favoritableId: number, favoritableType: string): boolean {
      return Object.values(this.favorites).some((fav) =>
          fav.some(
              (item) =>
                  item.recurso.id === favoritableId &&
                  item.recurso.coleccion === favoritableType
          )
      );
    },

    getFavoriteId(
        favoritableId: number,
        favoritableType: string
    ): number | null {
      const categoryFavorites = Object.entries(this.favorites).find(
          ([_, items]) =>
              items.some(
                  (item) =>
                      item.recurso.id === favoritableId &&
                      item.recurso.coleccion === favoritableType
              )
      );
      if (categoryFavorites) {
        const [, items] = categoryFavorites;
        const favoriteItem = items.find(
            (item) =>
                item.recurso.id === favoritableId &&
                item.recurso.coleccion === favoritableType
        );
        return favoriteItem ? favoriteItem.id : null;
      }
      return null;
    },

    clearFavorites() {
      this.favorites = {}; // Clear the favorites state
    },
  },
});
