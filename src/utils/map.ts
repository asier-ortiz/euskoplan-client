import type { Ref } from 'vue';

export const getMarkerImageUrl = (collection: string): string => {
    const categoryMarkerMap: { [key: string]: string } = {
        'alojamientos': '/images/map/accommodation-marker.png',
        'cuevas y restos arqueológicos': '/images/map/cave-marker.png',
        'edificios religiosos y castillos': '/images/map/cultural-marker.png',
        'espacios naturales': '/images/map/natural-marker.png',
        'eventos': '/images/map/event-marker.png',
        'localidades': '/images/map/locality-marker.png',
        'museos y centros de interpretación': '/images/map/museum-marker.png',
        'parques temáticos': '/images/map/fair-marker.png',
        'restaurantes': '/images/map/restaurant-marker.png',

        'accommodation': '/images/map/accommodation-marker.png',
        'cave': '/images/map/cave-marker.png',
        'cultural': '/images/map/cultural-marker.png',
        'event': '/images/map/event-marker.png',
        'fair': '/images/map/fair-marker.png',
        'locality': '/images/map/locality-marker.png',
        'museum': '/images/map/museum-marker.png',
        'natural': '/images/map/natural-marker.png',
        'restaurant': '/images/map/restaurant-marker.png',
    };

    return categoryMarkerMap[collection.toLowerCase()] || '/images/map/default-marker.png';
};

export const handleWheelZoom = (
    map: mapboxgl.Map | null,
    showZoomMessage: Ref<boolean>,
    zoomMessageTimeout: Ref<number | null>,
    mapContainer: HTMLElement | null
) => {
    return (event: WheelEvent) => {
        if (!mapContainer) return;

        const rect = mapContainer.getBoundingClientRect();
        const isInsideMap = (
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom
        );

        if (!isInsideMap) return;

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
