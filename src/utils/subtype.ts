// Determine the subtype based on collection type
export const getSubtype = (item: any): string => {
  if (item.coleccion.toLowerCase() === 'natural') {
    return (
      item.nombre_subtipo_recurso_espacio_natural ||
      item.nombre_subtipo_recurso_playas_pantanos_rios ||
      ''
    );
  } else if (item.coleccion.toLowerCase() === 'locality') {
    const cities = ['Bilbao', 'Vitoria-Gasteiz', 'San Sebastián'];
    return cities.includes(item.nombre.trim()) ? 'Ciudad' : 'Pueblo';
  }
  return item.nombre_subtipo_recurso || '';
};
