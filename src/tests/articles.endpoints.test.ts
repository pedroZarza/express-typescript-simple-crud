import supertest from "supertest";
import { App } from "../app";
import * as articleService from "../services/articlesService";
import { SimpleArticle } from "../interfaces/article.interface";
import productos from "@prisma/client";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';

require('dotenv').config();


const app = new App(3030).app;


describe("------Endpoints de articulos------", () => {
    let token: string;
    const article = [{
        Alias: "02170467378247343444",
        Numero_de_Parte: "11111111111",
        Detalle: "pedrito",
        Precio: 2333333.00,
        Moneda: "dolares",
        Cotizacion: "7.90",
        Tasa_IVA: "12.00",
        Tasa_Impuestos_Internos: "0.00",
        Stock: 3,
        Marca: "MARCA",
        Categoria: "MARCA",
        DescripcionTest: ""
    }]

    jest.mock("../services/articlesService");

    beforeAll(() => {
        const secretKey = String(process.env.SECRETKEY_JWT);
        token = jwt.sign({role: "ADMIN", email: "", invalidTokenId: uuidv4()}, secretKey, { expiresIn: 60 * 15 });
    })
    // beforeEach(()=>{
    // })
    describe("GET articles endpoints", () => {
        test("Debe devolver 200 (ok)", async () => {
            jest.spyOn(articleService, "readAllArticles").mockResolvedValue(article as SimpleArticle[]);
            await supertest(app).get("/articulos").set('Authorization', `Bearer ${token}`).expect(200);
        })

        test('Debe devolver 401 (no autorizado) | token no proporcionado', async () => {
            await supertest(app).get("/articulos").expect(401);
        });

        test("Debe devolver 201 (created)", async () => {
            // jest.spyOn(articleService, "saveArticle").mockResolvedValue(article[0] as any);
            await supertest(app).post("/articulos").set('Authorization', `Bearer ${token}`).send(article[0]).expect(201);
        })
    })
})