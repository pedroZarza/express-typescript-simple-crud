export const selectAllArticulos = `SELECT * FROM productos`;

export const selectAllArticulosByPage = selectAllArticulos + "\nLIMIT ? OFFSET ?";

export const selectArticleByAlias = selectAllArticulos + "\nWHERE alias = ?";
