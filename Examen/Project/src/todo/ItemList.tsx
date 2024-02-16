import React, {useContext, useEffect, useState} from 'react';
import { RouteComponentProps } from 'react-router';
import {
  IonButton,
  IonButtons,
  IonContent, IonHeader, IonLabel,
  IonList, IonLoading,
  IonPage, IonRadioGroup, IonSearchbar, IonSplitPane, IonTitle, IonToolbar
} from '@ionic/react';
import Item from './Item';
import Product from "./Product";
import { getLogger } from '../core';
import { ItemContext } from './ItemProvider';
import {ItemProps} from "./ItemProps";
import {ProductProps} from "./ProductProps";
import {queryByDisplayValue} from "@testing-library/react";
import {radio} from "ionicons/icons";

const log = getLogger('ItemList');

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { products, items, fetching, fetchingError, saveItem, page, total, canReDownload, reDownload, upload, uploadNr, uploading } = useContext(ItemContext);

  const [searchProduct, setSearchProduct] = useState('');
  const [shownProducts, setShownProducts] = useState<ProductProps[]>([]);
  const [selected, setSelected] = useState(-1);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (products && searchProduct && !fetching) {
      const filtered = products.filter(el => el.name.indexOf(searchProduct) !== -1).slice(0, 5);
      setShownProducts(filtered);
    }
  }, [searchProduct, products, fetching]);

  useEffect(() => {
    if(selected < 0) return;

    const quantity = prompt("Please enter the quantity:", "1");
    if (!quantity) return;

    const qval = parseInt(quantity);
    if (qval > 0) {
      setQuantity(qval);
    }

  }, [selected]);

  useEffect(() => {
    log('items changed', items);
  }, [items])

  const addItem = () => {
    const radioGroup = document.querySelector('.radi_group');
    saveItem?.({quantity: quantity, code: selected, submitted: "not_yet"});
    //alert("Added " + selected + " qt" + quantity);
  }

  const handleUpload = () => {
    upload?.(items);
  }

  log('render');
  return (
    <IonPage>
      <IonSplitPane when="xs" contentId="main">
        <IonContent>
            <IonHeader>
              <IonToolbar>
              {fetching && (
                  <IonHeader>Downloading {page} / {total / 10}</IonHeader>
              )}
              <IonSearchbar debounce={2000} onIonChange={ e => setSearchProduct(e.detail.value || '')}></IonSearchbar>
              <IonButtons slot="end">
                {/*{ !canReDownload &&
                    <IonButton>
                      Download
                    </IonButton>
                }*/}

                {canReDownload && (
                      <IonButton onClick={reDownload} size="small">
                        <IonLabel style={{fontSize: "10px"}}>
                          Resume download
                          <br>
                          </br>
                          from page {page}
                        </IonLabel>
                      </IonButton>
                  )
                }
                {selected >= 0 && (
                  <IonButton disabled={uploading} onClick={addItem}>
                    Add
                  </IonButton>
                )}
              </IonButtons>
              </IonToolbar>
            </IonHeader>
          <IonRadioGroup className="radio_group" onIonChange={ (ev) => { setSelected(ev.detail.value? parseInt(ev.detail.value): -1);} } allowEmptySelection={true}>
            {searchProduct !== "" && shownProducts.map(pr => (
                <Product key={pr.code} code={pr.code} name={pr.name}/>
            ))}
            {searchProduct === "" && products?.map(pr => (
                    <Product key={pr.code} code={pr.code} name={pr.name}/>
            ))}
          </IonRadioGroup>
        </IonContent>

        <div className="ion-page" id="main">
          <IonContent>
            <IonHeader>
              <IonToolbar>
                {uploading && (
                    <IonTitle>Uploading {uploadNr} / {items?.length}</IonTitle>
                )}
                <IonButtons slot="end">
                  <IonButton disabled={!(!uploading && items?.length!==0)} onClick={handleUpload}>
                    Upload
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonList>
              {items &&
                items.map(it =>
                <Item key={it.code} quantity={it.quantity} code={it.code} submitted={it.submitted}/>)
              }
            </IonList>
          </IonContent>
        </div>
      </IonSplitPane>
    </IonPage>
  );
};

export default ItemList;
