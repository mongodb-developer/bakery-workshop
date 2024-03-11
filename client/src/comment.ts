export interface Comment {
    _id?: string;
    cakeId?: string;
    name: string;
    text: string;
    date: Date;
    sentiment?: {
        documentSentiment?: {
            magnitude: number;
            score: number;
        }
    };
}
