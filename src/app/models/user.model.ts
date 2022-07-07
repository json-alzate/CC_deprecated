export interface User {
    uid: string;
    name: string;
    elo: number;
    scoreCoordinatesW?: number;
    scoreCoordinatesB?: number;
    country?: string;
    createAt: number;
    urlAvatar?: string;
}
