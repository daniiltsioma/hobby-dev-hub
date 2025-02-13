import mongoose from "mongoose";

const DATABASE_URI = process.env.MONGODB_URI;

if (!DATABASE_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

declare global {
    var mongoose: {
        connection: mongoose.Connection | null;
        promise: Promise<typeof mongoose> | null;
    };
}

let cachedConnection = (global as any).mongoose || {
    connection: null,
    promise: null,
};

export default async function connectToDatabase() {
    if (cachedConnection.connection) {
        return cachedConnection.connection;
    }

    if (!cachedConnection.promise && DATABASE_URI) {
        cachedConnection.promise = mongoose
            .connect(DATABASE_URI)
            .then((mongoose) => {
                cachedConnection.connection = mongoose;
                return mongoose;
            });
    }

    cachedConnection.connection = await cachedConnection.promise;
    return cachedConnection.connection;
}
