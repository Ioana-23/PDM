import { useEffect, useState } from 'react';
import { useCamera } from './useCamera';
import { useFilesystem } from './useFilesystem';
import { usePreferences } from './usePreferences';
import {getLogger} from "../core";
import * as punycode from "punycode";
const log = getLogger('use Photo');

export interface MyPhoto {
  id?: string,
  filepath: string;
  webviewPath?: string;
}

const PHOTOS = 'photos';

export function usePhotos() {
  const [photos, setPhotos] = useState<MyPhoto[]>([]);
  const { getPhoto } = useCamera();
  const { readFile, writeFile, deleteFile } = useFilesystem();
  const { get, set } = usePreferences();
  useEffect(loadPhotos, [get, readFile, setPhotos]);
  return {
    photos,
    takePhoto,
    deletePhoto,
    saveServerPhotos,
  };

  async function takePhoto(id: string) {
    const { base64String } = await getPhoto();
    const filepath = new Date().getTime() + '.jpeg';
    await writeFile(filepath, base64String!);
    const webviewPath = `data:image/jpeg;base64,${base64String}`
    const newPhoto = {id, filepath, webviewPath };
    const newPhotos = [newPhoto, ...photos];
    await set(PHOTOS, JSON.stringify(newPhotos));
    setPhotos(newPhotos);
  }

  async function saveServerPhotos(photosAux: MyPhoto[])
  {
    const newPhotos: MyPhoto[] = [];
    for (let i = 0; i < photosAux.length; i++)
    {
      const newPhoto = photosAux[i];
      await writeFile(newPhoto.filepath, newPhoto.webviewPath?.substring(23)!);
      newPhotos.push(newPhoto);
    }
    await set(PHOTOS, JSON.stringify(newPhotos));
    setPhotos(newPhotos);
  }

  async function deletePhoto(photo: MyPhoto) {
    const newPhotos = photos.filter(p => p.filepath !== photo.filepath);
    await set(PHOTOS, JSON.stringify(newPhotos));
    await deleteFile(photo.filepath);
    setPhotos(newPhotos);
  }

  function loadPhotos() {
    loadSavedPhotos();

    async function loadSavedPhotos() {
      const savedPhotoString = await get(PHOTOS);
      const savedPhotos = (savedPhotoString ? JSON.parse(savedPhotoString) : []) as MyPhoto[];
      console.log('load', savedPhotos);
      for (let photo of savedPhotos) {
        const data = await readFile(photo.filepath);
        photo.webviewPath = `data:image/jpeg;base64,${data}`;
      }
      setPhotos(savedPhotos);
    }
  }
}
