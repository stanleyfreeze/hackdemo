import Dexie, { Table } from 'dexie';

export interface Album {
    id?: number;
    date: string;
    path: string;
    img: string;
}

export class screenShotDexie extends Dexie {
    // 'friends' is added by dexie when declaring the stores()
    // We just tell the typing system this is the case
    album!: Table<Album>; 

    constructor() {
        super('albumbase');
        this.version(1).stores({
            album: '++id, date, path, img' // Primary key and indexed props
        });
    }
}
const db = new screenShotDexie();
export default db