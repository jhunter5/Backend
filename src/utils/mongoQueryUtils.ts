// TODO: Los valores en la base de datos no estan normalizados, agregar a los campos de texto la validación
// de cadenas tomando en cuenta accentos y diacríticos.
export const applyQueryFilters = (query: any, regexFields: string[], exactFields: string[]) => {
  const filter: any = {};

  regexFields.forEach(field => {
    if (query[field]) {
      if (Array.isArray(query[field])) {
        filter[field] = { $in: query[field].map((value: string) => new RegExp(value, "i")) };
      } else {
        filter[field] = { $regex: new RegExp(query[field], "i") };
      }
    }
  });

  exactFields.forEach(field => {
    if (query[field]) {
      if (Array.isArray(query[field])) {
        filter[field] = { $in: query[field] };
      } else {
        filter[field] = query[field];
      }
    }
  });

  return filter;
}

