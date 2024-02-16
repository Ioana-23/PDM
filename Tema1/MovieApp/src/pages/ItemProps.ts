import {MyPhoto} from "./usePhotos";
import {Position} from "@capacitor/geolocation";
export interface MyPosition {
    latitude: number,
    longitude: number
}
export interface ItemProps {
    _id?: string;
    title: string;
    review: number;
    date: Date;
    watched: Boolean;
    location?: MyPosition;
    photo?: MyPhoto;
}
