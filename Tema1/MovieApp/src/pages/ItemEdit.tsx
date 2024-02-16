import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    createAnimation,
    CreateAnimation,
    IonActionSheet,
    IonButton,
    IonButtons,
    IonCheckbox,
    IonCol,
    IonContent,
    IonDatetime,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonImg,
    IonInput,
    IonLoading,
    IonPage,
    IonRow,
    IonTitle,
    IonToolbar,
    useIonAlert
} from '@ionic/react';
import {getLogger} from '../core';
import {ItemContext} from './ItemProvider';
import {RouteComponentProps} from 'react-router';
import {ItemProps} from './ItemProps';
import {camera, trash} from "ionicons/icons";
import {MyPhoto, usePhotos} from "./usePhotos";
import MyMap from "./MyMap";

const log = getLogger('ItemEdit');

interface ItemEditProps extends RouteComponentProps<{
    id?: string;
}> {}

const ItemEdit: React.FC<ItemEditProps> = ({ history, match }) => {
    const { items, saving, savingError, saveItem } = useContext(ItemContext);
    const [title, setTitle] = useState('');
    const [review, setReview] = useState('');
    const [date, setDate] = useState('2002-06-23T23:15');
    const [watched, setWatched] = useState<Boolean>(false);
    const [photo, setPhoto] = useState<MyPhoto>();
    const refTitle = useRef(null);
    const refReview = useRef(null);
    const titleAnimation = useRef<Animation | null>(null);
    const reviewAnimation = useRef<Animation | null>(null);
    const [item, setItem] = useState<ItemProps>();
    const {photos, takePhoto, deletePhoto} = usePhotos();
    const [photoToDelete, setPhotoToDelete] = useState<MyPhoto>();
    const [presentAlert] = useIonAlert();
   // let latitude: number = 47.0675749;
   // let longitude: number = 21.9188806;
    const [latitude, setLatitude] = useState<number>();
    const [longitude, setLongitude] = useState<number>();

    const el = document.querySelector('.container');



    function titleAnimationFn() {
        if(titleAnimation.current === null)
        {
            titleAnimation.current = createAnimation()
                .addElement(refTitle.current!)
                .duration(300)
                //.direction('alternate')
                .iterations(Infinity)
                /*.beforeStyles({
                    "border": '1px solid red'
                })
                .beforeClearStyles(["border"])*/
                .keyframes([
                    {offset: 0, transform: 'rotate(0)'},
                    {offset: 0.33, transform: 'rotate(10deg)'},
                    {offset: 0.66, transform: 'rotate(-10deg)'},
                    {offset: 1, transform: 'rotate(0)'}
                ]);
        }
        const titleInput = document.querySelector('.title');
        if(title === '')
        {
            titleInput.style.border = "2px solid red";
            titleAnimation.current?.play();
        }
        else
        {
            titleInput.style.border = "0px solid";
            titleAnimation.current?.stop();
        }
    }
    function reviewAnimationFn() {
        if(reviewAnimation.current === null)
        {
            reviewAnimation.current = createAnimation()
                .addElement(refReview.current!)
                .duration(300)
                //.direction('alternate')
                .iterations(Infinity)
                /*.beforeStyles({
                    "border": '1px solid red'
                })
                .beforeClearStyles(["border"])*/
                .keyframes([
                    {offset: 0, transform: 'rotate(0)'},
                    {offset: 0.33, transform: 'rotate(10deg)'},
                    {offset: 0.66, transform: 'rotate(-10deg)'},
                    {offset: 1, transform: 'rotate(0)'}
                ]);
        }
        const reviewInput = document.querySelector('.review');
        if(review === '')
        {
            reviewInput.style.border = "2px solid red";
            reviewAnimation.current?.play();
        }
        else
        {
            reviewInput.style.border = "0px solid";
            reviewAnimation.current?.stop();
        }
    }
    useEffect(titleAnimationFn , [refTitle , title]);
    useEffect(reviewAnimationFn , [refReview , review]);

    useEffect(() => {
        log('useEffect');
        const routeId = match.params.id || '';
        const item = items?.find(it => it._id === routeId);
        setItem(item);
        if (item) {
            setTitle(item.title);
            setReview(item.review.toString());
            setDate(item.date.toString());
            setWatched(item.watched);
            setPhoto(photos?.find(it => it.id === routeId) || item.photo);
            if(item.location?.latitude)
            {
                setLatitude(item.location.latitude);
                setLongitude(item.location.longitude);
                //log(latitude + "------------" + item.location.latitude);
                //longitude = item.location.longitude!;
            }
            else
            {
                setLatitude(47);
                setLongitude(21);
            }
            /*latitude = item.location?.latitude!;
            longitude = item.location?.longitude!;*/
        }
    }, [match.params.id, items]);
    useEffect(() => {                log(latitude + "------------" + item?.location?.latitude);
    }, [latitude])
    const handleSave = () => {
        const editedItem = item ? { ...item, title, review: Number.parseFloat(review), date: new Date(date), watched: Boolean(watched), photo: photos?.find(it => it.id === match.params.id), location: { latitude: /*47.32753958239328*/latitude!, longitude: /*22.369320053124984*/longitude!} } : { title, review: Number.parseFloat(review), date: new Date(date), watched: Boolean(watched), photo, location: { latitude: 47.32753958239328, longitude: 22.369320053124984} };
        saveItem && saveItem(editedItem).then(() => history.goBack());
    };
    log('render');

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Edit</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleSave}>
                            Save
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonRow>
                    <IonCol>
                        <IonRow>
                            <IonCol size="3" key="2">
                                <IonImg alt="NO PHOTO" onClick={() => setPhotoToDelete(photos?.find(it => it.id === match.params.id))} src={photos?.find(it => it.id === match.params.id)?.webviewPath}></IonImg>
                            </IonCol>
                            <IonCol size="4">
                                <IonRow>
                                    <IonTitle>
                                        <IonInput className="title" ref={refTitle} style={{transformOrigin: "center center"}} label={"Title"} value={title} onIonChange={e => {setTitle(e.detail.value || '')}} />
                                    </IonTitle>
                                </IonRow>
                                <IonRow>
                                    <IonTitle>
                                        <IonInput className="review" ref={refReview} style={{transformOrigin: "center center"}} label={"Review"} value={review} onIonChange={e => {
                                            if(e.detail.value === '')
                                            {
                                                setReview('')
                                            }
                                            if(Number.parseFloat(e.detail.value || '').toString()!='NaN' && Number.parseFloat(e.detail.value || '').toString().length==(e.detail.value || '').length){
                                                setReview(Number.parseFloat(e.detail.value || '').toString() || '')
                                            }}}/>
                                    </IonTitle>
                                </IonRow>
                                <IonRow>
                                    <IonTitle>
                                        <IonCheckbox title={"Watched"} checked={watched == true} value={watched} onIonChange={e => setWatched(e.detail.checked == true)}>Watched</IonCheckbox>
                                    </IonTitle>
                                </IonRow>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size="3.5">
                                {latitude && longitude &&
                                    <MyMap
                                        lat={latitude}
                                        lng={longitude}
                                        onMapClick={handleUpdateCoords()}
                                        onMarkerClick={showCoords()}/>
                                }
                            </IonCol>
                        </IonRow>
                    </IonCol>
                    <IonCol>
                        <IonDatetime size={"cover"}  presentation="date" value={date} onIonChange={e => setDate(e.detail.value || '')}><span slot={"title"}>Select the date</span></IonDatetime>
                    </IonCol>
                </IonRow>
                <IonLoading isOpen={saving} />
                {savingError && (
                    <div>{savingError.message || 'Failed to save item'}</div>
                )}
                <IonFab vertical="bottom" horizontal="center" slot="fixed">
                    <IonFabButton onClick={() => takePhoto(match.params.id || '')}>
                        <IonIcon icon={camera}/>
                    </IonFabButton>
                </IonFab>
                <IonActionSheet
                    isOpen={!!photoToDelete}
                    buttons={[{
                        text: 'Delete',
                        role: 'destructive',
                        icon: trash,
                        handler: () => {
                            if (photoToDelete) {
                                deletePhoto(photoToDelete);
                                setPhotoToDelete(undefined);
                            }
                        }
                    }, {
                        text: 'Cancel',
                        icon: close,
                        role: 'cancel'
                    }]}
                    onDidDismiss={() => setPhotoToDelete(undefined)}
                />
            </IonContent>
        </IonPage>
    );
    function showCoords() {
        return (e: any) => {
            presentAlert({
                header: 'Alert',
                subHeader: 'Your coordinates',
                message: 'Latitude: ' + e.latitude + " \nLongitude: " + e.longitude,
                buttons: ['OK']
            });
        }
    }
    function handleUpdateCoords() {
        return (e: any) => {
            /*presentAlert({
                header: 'Alert',
                subHeader: 'Your coordinates',
                message: 'Latitude: ' + e.latitude + " \nLongitude: " + e.longitude,
                buttons: ['OK']
            });*/
            setLatitude(e.latitude);
            setLongitude(e.longitude);
        }
    }
};

export default ItemEdit;
