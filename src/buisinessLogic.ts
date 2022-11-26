import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React from 'react';
import { FilesInfo } from './components/CreateNewPost';
import { storage } from './firebase-config';
import { setAlertDisable, setAlertVisible } from './redux/slices/alertSlice';

export const getColorFromLS = (elementRef: React.MutableRefObject<null>) => {
  if (localStorage.getItem('colors') != null) {
    const { bodyColor, wrapperColor } = JSON.parse(localStorage.getItem('colors') as string);
    document.body.style.backgroundColor = bodyColor;
    if (elementRef.current) {
      const htmlElement = elementRef.current as HTMLElement;
      htmlElement.style.backgroundColor = wrapperColor;
    }
  }
};

export const changeColor = (elementRef: React.MutableRefObject<null>, color: string) => {
  if (elementRef.current) {
    const htmlElement = elementRef.current as HTMLElement;
    htmlElement.style.backgroundColor = color;
  }
};

export const showAlert = (message: string, dispatch: Dispatch<AnyAction>) => {
  dispatch(setAlertVisible(message));
  setTimeout(() => dispatch(setAlertDisable()), 2000);
};

export const uploadAndGetUrl = async (file: File): Promise<FilesInfo> => {
  try {
    const id = (+new Date()).toString(16);
    const fileRef = ref(storage, `files/${file.name}${id}`);
    await uploadBytes(fileRef, file);
    const fileUrl = await getDownloadURL(fileRef);

    return {
      id: id,
      fileName: `${file.name}${id}`,
      fileUrl: fileUrl,
    };
  } catch (error) {
    throw error;
  }
};
