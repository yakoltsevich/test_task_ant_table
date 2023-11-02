import {Moment} from "moment/moment";

export interface Item {
    key: string;
    date: Moment;
    amount: number;
    type: string;
    note: string;
}
