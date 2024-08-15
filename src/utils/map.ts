// src/utils/map.ts
import type { Ref } from 'vue';

export const getMarkerImageUrl = (collection: string): string => {
    const categoryMarkerMap: { [key: string]: string } = {
        'alojamientos': '/images/map/accommodations-marker.png',
        'cuevas y restos arqueológicos': '/images/map/caves-marker.png',
        'edificios religiosos y castillos': '/images/map/culturals-marker.png',
        'eventos': '/images/map/events-marker.png',
        'parques temáticos': '/images/map/fairs-marker.png',
        'museos y centros de interpretación': '/images/map/museums-marker.png',
        'espacios naturales': '/images/map/naturals-marker.png',
        'restaurantes': '/images/map/restaurants-marker.png',
        'accommodation': '/images/map/accommodations-marker.png',
        'cave': '/images/map/caves-marker.png',
        'cultural': '/images/map/culturals-marker.png',
        'event': '/images/map/events-marker.png',
        'fair': '/images/map/fairs-marker.png',
        'museum': '/images/map/museums-marker.png',
        'natural': '/images/map/naturals-marker.png',
        'restaurant': '/images/map/restaurants-marker.png',
    };

    return categoryMarkerMap[collection.toLowerCase()] || '/images/map/default-marker.png';
};

export const handleWheelZoom = (
    map: mapboxgl.Map | null,
    showZoomMessage: Ref<boolean>,
    zoomMessageTimeout: Ref<number | null>
) => {
    return (event: WheelEvent) => {
        if (event.ctrlKey || event.metaKey) {
            map?.scrollZoom.enable();
            event.preventDefault();
        } else {
            map?.scrollZoom.disable();
            showZoomMessage.value = true;
            if (zoomMessageTimeout.value) {
                clearTimeout(zoomMessageTimeout.value);
            }
            zoomMessageTimeout.value = window.setTimeout(() => {
                showZoomMessage.value = false;
            }, 2000);
        }
    };
};
