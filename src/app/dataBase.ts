import Dexie, { Table } from 'dexie';

interface Image {
    urlId: string;
    url: string;
    timestamp: number; 
}

class ImagesDataBase extends Dexie {
    images!: Table<Image>; 

    constructor() {
        super('imagesDataBase');

        this.version(1).stores({
            images: 'urlId, url, timestamp' 
        });
    }
}

const db = new ImagesDataBase();
export default db;
