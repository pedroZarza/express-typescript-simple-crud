import { RowDataPacket } from "mysql2"


export interface SimpleArticle extends RowDataPacket {
    Alias: string,
    Numero_de_Parte: string,
    Detalle: string,
    Precio: number,
    Moneda: string
    Cotizacion: string,
    Tasa_IVA: string
    Tasa_Impuestos_Internos: string,
    Stock: number,
    Marca: string,
    Categoria: string,
    DescripcionTest: string,
    detalleEndpoint?: string
}


