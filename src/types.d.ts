import { Connection } from "mongoose";

declare global {
    var mongoose: {
        Types: typeof import("mongoose").Types;
        conn: Connection | null;
        promise: Promise<Connection> | null;
    }
}

export { }