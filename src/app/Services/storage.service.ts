import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Time } from '@angular/common';
import { NonNullAssert } from '@angular/compiler';

const ENTRY_KEY = 'Temp-entries';
const ENTRY_KEY_DARKMODE = 'DarkMode-State';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private storage: Storage) { }


  //* Create/add entry
  addEntry(entry: IexeedEntry): Promise<any> {
    return this.storage.get(ENTRY_KEY).then((entries: IexeedEntry[]) => {
      if (entries) {
        entries.push(entry);
        return this.storage.set(ENTRY_KEY, entries);
      }
      else {
        return this.storage.set(ENTRY_KEY, [entry]);
      }
    })
  }

   //* Create/add entry DarkMode
   addEntryDarkMode(entry: IBoolDarkMode): Promise<any> {
    return this.storage.get(ENTRY_KEY_DARKMODE).then((entries: IBoolDarkMode[]) => {
      if (entries) {
        entries.push(entry);
        return this.storage.set(ENTRY_KEY_DARKMODE, entries);
      }
      else {
        return this.storage.set(ENTRY_KEY_DARKMODE, [entry]);
      }
    });
  }

  //* get entries
  getEntries(): Promise<IexeedEntry[]> {
    return this.storage.get(ENTRY_KEY);
  }

  //* get entries DarkMode
  getEntriesDarkMode(): Promise<IBoolDarkMode[]> {
    return this.storage.get(ENTRY_KEY_DARKMODE);
  }

  //* UPDATE DarkMode
  updateDarkMode(item: IBoolDarkMode): Promise<any> {
    return this.storage.get(ENTRY_KEY_DARKMODE).then((entries: IBoolDarkMode[]) => {
      if (!entries || entries.length === 0) {
          return null;
      }

      let newEntry: IBoolDarkMode[] = [];

      for (let i of entries){
        if (i.DarkModeState === item.DarkModeState){
          newEntry.push(item);
        }else{
          newEntry.push(i);
        }
      }

      return this.storage.set(ENTRY_KEY_DARKMODE, newEntry);
    });
  }

  //* Delete entries
  deleteEntry(id: number): Promise<IexeedEntry> {
    return this.storage.get(ENTRY_KEY).then((entries: IexeedEntry[]) => {
      if (!entries || entries.length === 0) {
        return null;
      }

      let tokeep: IexeedEntry[] = [];

      for (let i of entries) {
        if (i.id !== id) {
          tokeep.concat(i);
        }
      }

      return this.storage.set(ENTRY_KEY, tokeep);
    })
  }

  deleteAllEntries(): Promise<void> {
    return this.storage.clear();
  }
}

export interface IexeedEntry {
  id: number,
  temperature: number,
  humidity: number,
  date: Date,
  time: Time,
  rangeCount: number
}
export interface IBoolDarkMode{
  DarkModeState: boolean
}