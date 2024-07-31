<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script>
import mapboxgl from 'mapbox-gl';

export default {
  name: 'MapboxMap',
  props: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  mounted() {
    mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'; // Use your Mapbox access token here

    // Initialize Mapbox map
    const map = new mapboxgl.Map({
      container: this.$refs.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11', // Choose a Mapbox style
      center: [this.lng, this.lat],
      zoom: 13
    });

    // Add a marker to the map
    new mapboxgl.Marker()
      .setLngLat([this.lng, this.lat])
      .addTo(map);
  }
};
</script>

<style scoped>
.map-container {
  height: 400px;
  width: 100%;
}
</style>
