import { createClient, RedisClientType } from "redis";
import { SimpleArticle } from "../../interfaces/article.interface";

require('dotenv').config();


class RedisConnection {
    private host: string;
    private port: number;
    public client: RedisClientType | null;

    constructor() {
        this.host = String(process.env.REDIS_HOST);
        this.port = Number(process.env.REDIS_PORT);
        this.client = null;
    }

    private async createRedisClient() {
        this.client = createClient()
        this.client.on("error", (err) => console.error(err))
        await this.client.connect()
        console.log("Redis client connected");
    }

    private async getClient(): Promise<RedisClientType> {
        if (this.client === null) {
            await this.createRedisClient()
        }
        return this.client as RedisClientType;
    }

    /** retorna articulos o error */
    async readRedisArticles(): Promise<SimpleArticle[] | undefined | never> {
        const redis = await this.getClient();
        const articulos = await redis.get("articulos");
        if (articulos) {
            return JSON.parse(articulos);
        }
    }

    async writeRedisArticles(articles: SimpleArticle[]): Promise<String | undefined | never> {
        const redis = await this.getClient();
        const articulos = await redis.setEx("articulos", 60 * 10, JSON.stringify(articles));
        return articulos;

    }
    async deleteRedisArticles(): Promise<String | undefined | void> {
        const redis = await this.getClient();
        await redis.del("articulos");
    }
    //refresh token blcklist
    async checkInvalidToken(invalidTokenId: string): Promise< number | undefined | never> {
        const redis = await this.getClient();
        return await redis.exists(invalidTokenId); 
    }
    async writeInvalidToken(invalidToken: string, invalidTokenId: string): Promise<undefined | never> {
       const redis = await this.getClient();
       await redis.setEx(invalidTokenId, 3600*24*36, invalidToken);
    }
}

export const Redis = new RedisConnection();



// class RedisConnect {
//     private static instance: RedisConnect;
//     client: RedisClientType;
//     private constructor() {
//         this.client = createClient({
//             socket: {
//                 host: process.env.REDIS_HOST,
//                 port: Number(process.env.REDIS_PORT)
//             }
//         })
//     }
//     static getClient() {
//         if (!RedisConnect.instance) {
//             RedisConnect.instance = new RedisConnect();

//         }
//         return RedisConnect.instance;
//     }
  
// }
// const redis = RedisConnect.getClient();






  // async readRedisArticles(): Promise<SimpleArticle[] | undefined | never> {
    //     const articulos = await this.client.get("articulos");
    //     if (articulos) {
    //         return JSON.parse(articulos);
    //     }
    // }

    // async writeRedisArticles(articles: SimpleArticle[]): Promise<String | undefined | never> {
    //     const articulos = await this.client.setEx("articulos", 60 * 10, JSON.stringify(articles));
    //     return articulos;

    // }
    // async deleteRedisArticles(): Promise<String | undefined | void> {
    //     await this.client.del("articulos");
    // }




