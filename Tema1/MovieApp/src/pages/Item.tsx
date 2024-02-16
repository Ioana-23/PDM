import React from 'react';
import {IonCheckbox, IonCol, IonContent, IonImg, IonItem, IonLabel, IonRow, IonTitle} from '@ionic/react';
import { getLogger } from '../core';
import { ItemProps } from './ItemProps';
import MyMap from "./MyMap";

const log = getLogger('Item');

interface ItemPropsExt extends ItemProps {
    onEdit: (_id?: string) => void;
}

const Item: React.FC<ItemPropsExt> = ({ _id, title, date,review,watched, photo, location,onEdit }) => {
    return (
        <IonItem onClick={() => onEdit(_id)}>
            <IonCol size="1">
                <IonImg src={photo?.webviewPath}></IonImg>
            </IonCol>
            <IonCol>
                <IonTitle title="titlu">
                    <IonLabel>{title}</IonLabel>
                </IonTitle>
                <IonTitle title="data">
                    <IonLabel>{date.toString().substring(0,10)}</IonLabel>
                </IonTitle>
                <IonTitle title="review">
                    <IonLabel>{review}</IonLabel>
                </IonTitle>
                <IonTitle title="watched">
                    <IonLabel aria-disabled={true}>
                        <IonCheckbox aria-label="Label" checked={String(watched) == "true"}></IonCheckbox>
                    </IonLabel>
                </IonTitle>
            </IonCol>
        </IonItem>
    );
};

export default Item;
