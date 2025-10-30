import jwt from "jsonwebtoken";
import { envsObject } from "../../config/env.js";

export interface TokenPayload {
    id: string;
    email: string;
    role: string;
}

export class JWTService {
    private readonly secret: string;

    constructor() {
        this.secret = envsObject.jwt_secret;
    }

    generateToken(payload: TokenPayload): string {
        return jwt.sign(payload, this.secret, { expiresIn: "5m" });
    }

    verifyToken(token: string): TokenPayload {
        return jwt.verify(token, this.secret) as TokenPayload;
    }
}