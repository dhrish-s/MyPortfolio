// src/queries/getDatoCmsToken.ts
export const getDatoCmsToken = (): string => {
  const token = process.env.REACT_APP_DATOCMS_API_TOKEN;
  if (!token) {
    throw new Error("No DatoCMS token configured. Did you set REACT_APP_DATOCMS_API_TOKEN?");
  }
  return token;
};
