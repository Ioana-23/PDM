import React from 'react';
import {IonCol, IonItem, IonLabel, IonRow} from '@ionic/react';
import { ItemProps } from './ItemProps';

const Item: React.FC<ItemProps> = ({ code, quantity, submitted }) => {
  return (
    <IonItem>
        <IonRow>
            <IonCol>
                <IonLabel>code:{code}</IonLabel>
            </IonCol>
            <IonCol>
                <IonLabel></IonLabel>
            </IonCol>
            <IonCol>
                <IonLabel>quantity:{quantity}</IonLabel>
            </IonCol>
            {submitted === "yes" && (
                <IonCol>
                    <IonLabel>[Submitted]</IonLabel>
                </IonCol>
            )}
            {submitted === "about_to" && (
                <IonCol>
                    <IonLabel>[Submitting...]</IonLabel>
                </IonCol>
            )}
            {submitted === "no" && (
                <IonCol>
                    <IonLabel>[Failed]</IonLabel>
                </IonCol>
            )}
        </IonRow>
    </IonItem>
  );
};

export default Item;
