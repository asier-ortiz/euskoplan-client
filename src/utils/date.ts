// Helper function to format date as YYYY/MM/DD
export const formatDateForApi = (date: any) => {
  if (!date) return null;
  const options: any = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Intl.DateTimeFormat('es-ES', options)
    .format(new Date(date))
    .split('/')
    .reverse()
    .join('/');
};
