'use client'

import { ChangeEvent, FC, useEffect, useState, useRef } from "react";
import db from "./dataBase";
import './photos.css';

interface Item{
    urlId: string,
    url: string,
}

const AddPhotos: FC = () => {
    const [photos, setPhotos] = useState<string[]>([]);
    const [load, setLoad] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null); 
    let loading;

    if (load) {
        loading = <p className="loading">Loading...</p>;
    }

    useEffect(() => {
        setLoad(true);
        const getPhotos = async () => {
            const imagesObj = await db.images.toArray();
            const sortObj = await imagesObj.sort((a: any, b: any) => b.timestamp - a.timestamp)
            const imagesStore = await sortObj.map((item: Item) => item.url);
            setPhotos(imagesStore);
            setLoad(false);
        }
        getPhotos();
    }, []);

    const deletePhoto = async (item: string) => {
        await db.images.delete(item);
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;  
        if (files) {
            const file = files[0];
            if (file) {                  
                const reader = new FileReader();               
                reader.onload = (e) => {
                    const result = e.target?.result;
                    if (typeof result === "string") {
                        setPhotos([result, ...photos]);
                        const addPhoto = async () => {
                            await db.images.add({ urlId: result, url: result, timestamp: Date.now()})
                        }
                        addPhoto()
                    }
                };
                reader.readAsDataURL(file); 
            }
        }
    };

    return (
        <div className="container">
            <h2>Upload Photos</h2>
            <button 
                className="custom-upload-button"
                onClick={() => fileInputRef.current?.click()} 
            >
                Choose File
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
            />
            {loading}
            <ul className="photo-list">
                {photos.map((item) => (
                    <li key={item} className="photo-item">
                        <img src={item} width={100} height={100}/>
                        <button 
                            className="delete-button" 
                            onClick={() => {
                                const filteredArr = photos.filter(el => el !== item);   
                                setPhotos(filteredArr);
                                deletePhoto(item);
                            }}
                        >
                            Delete
                        </button>
                    </li>
                ))}               
            </ul>
        </div>
    );
}

export default AddPhotos;
