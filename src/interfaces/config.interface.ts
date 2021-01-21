export interface MongoOptions {
    useCreateIndex: boolean;
    useFindAndModify: boolean;
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
}

export interface Mongo {
    uri: string;
    options: MongoOptions;
}

export default interface IConfig {
    port: number;
    mongo: Mongo;
}
