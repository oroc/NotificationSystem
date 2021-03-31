export interface IDatabase {
    subscriptions: {
        topic: string,
        subscribers: Array<any>
    };
}