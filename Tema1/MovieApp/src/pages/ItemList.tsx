import React, {useCallback, useContext, useEffect, useState} from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonSelectOption,
  IonSelect,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonAlert,
  IonRefresher,
  IonRefresherContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonCard
} from '@ionic/react';
import {add, logOut} from 'ionicons/icons';
import Item from './Item';
import {authConfig, getLogger} from '../core';
import {initialStateItems, ItemContext, ItemsState, NUMBER_OF_MOVIES_PER_PAGE} from './ItemProvider';
import { useAppState } from './useAppState';
import { useNetwork } from './useNetwork';
import {Preferences} from "@capacitor/preferences";
import {AuthContext, AuthState, initialState} from "../auth";
import item from "./Item";
import {getItems} from "./itemApi";
import {ItemProps} from "./ItemProps";
import axios from "axios";
import {usePhotos} from "./usePhotos";
const log = getLogger('ItemList');

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError, paginationFunction, setItems, reviews} = useContext(ItemContext);
  const { logout} = useContext(AuthContext);
  const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false)
  const [searchMovie, setSearchMovie] = useState<string>('');
  const [filter, setFilter] = useState<string>('');
  const { appState } = useAppState();
  const { networkStatus } = useNetwork();
  log('render', fetching);
  async function fetchData() {
    if(items)
    {
      paginationFunction?.(items[items.length-1]).then((result) => {
        if(result)
        {
          if (result && result.length)
          {
            setDisableInfiniteScroll(result.length < NUMBER_OF_MOVIES_PER_PAGE);
          }
          else
          {
            setDisableInfiniteScroll(true);
          }
          const itemsFinal: ItemProps[] = [];
          for(let i = 0; i < items.length; i++)
          {
            itemsFinal.push(items[i]);
          }
          for(let i = 0; i < result.length; i++)
          {
            itemsFinal.push(result[i]);
          }
          setItems?.(itemsFinal);
        }
      });
    }
  }
  async function searchNext($event: CustomEvent<void>) {
    fetchData();
    await ($event.target as HTMLIonInfiniteScrollElement).complete();
  }

  return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Movie List</IonTitle>
          </IonToolbar>
          <IonFab vertical="top" horizontal="end">
            <IonFabButton onClick={() => {
              Preferences.remove({key: "user"});
              logout?.();
              history.push("/");
            }}>
              <IonIcon icon={logOut}/>
            </IonFabButton>
          </IonFab>
          <IonToolbar>
            <IonItem>
              <IonLabel>App state is {JSON.stringify(appState)}</IonLabel>
              <IonLabel>Network status is {JSON.stringify(networkStatus)}</IonLabel>
            </IonItem>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonLoading isOpen={fetching} message="Fetching items"/>
          <IonSearchbar
              value={searchMovie}
              debounce={1000}
              onIonInput={e => setSearchMovie(e.detail.value!)}>
          </IonSearchbar>
          <IonSelect value={filter} placeholder="Select Review" onIonChange={e => setFilter((e.detail.value))}>
            {
              reviews.map(review => <IonSelectOption key={review} value={review}>{review}</IonSelectOption>)
            }
          </IonSelect>
          {items && (
              <IonList>
                {items
                    .filter(item => item.title.toString().includes(searchMovie) && ( filter!== "" ? item.review >= Number(filter) && item.review < Number(filter) + 1 : true))
                    .map(({ _id, title, review, date, watched, location, photo}) =>
                        <Item key={_id} _id={_id} title={title} review={review} date={date} watched={watched} photo={photo} location={location} onEdit={ _id => history.push(`/item/${_id}`)}/>)}
              </IonList>
          )}
          <IonInfiniteScroll threshold="100px" disabled={disableInfiniteScroll}
                             onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
            <IonInfiniteScrollContent loadingText="Loading more movies..."></IonInfiniteScrollContent>
          </IonInfiniteScroll>
          {fetchingError && (
              <div>{fetchingError.message || 'Failed to fetch items'}</div>
          )}
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={() => history.push('/item')}>
              <IonIcon icon={add}/>
            </IonFabButton>
          </IonFab>
        </IonContent>
      </IonPage>
  );
};

export default ItemList;
