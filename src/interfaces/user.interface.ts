export enum ROLE {
    ADMIN = "ADMIN", 
    CUSTOMER = "CUSTOMER"
}

export interface SimpleUser {
    id: number,
    email: string,
    name: string,
    password: string,
    role?: ROLE,
    createdAt?: Date,
    updatedAt?: Date
}