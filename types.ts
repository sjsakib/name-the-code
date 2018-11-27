import { Action } from 'redux';

export interface User {
    uid: string;
    name: string;
    photo: string
}

export interface State {
  status: Status;
  currentAlgo: string;
  preferredLan: string;
  options: Array<string>;
  currentAns: string;
  message: string;
  score: number;
  life: number;
  time: number;
  currentLan: string;
  codes: {
    [key: string]: { [key: string]: string };
  };
  data: {
    [key: string]: {
      level: string;
      name: string;
      codes: { [key: string]: string };
    };
  };
  list: Array<string>;

  authenticating: boolean;
  loadingUI: boolean;
  user?: User;
}

export enum Status {
  FETCHING_LIST,
  FETCHED_LIST,
  FETCHING_CODES
}

export const defaultLan = 'cpp';

export interface RootAction extends Action {
  [key: string]: any;
}


// Home
export interface HomeProps {
  loadingUI: boolean;
  authenticating: boolean;
  user?: User;
}
export interface HomeMethods {
  startUI: () => void;
}


// Game
export interface GameProps {
  authenticating: boolean;
  status: Status;
  options: Array<{ name: string; id: string }>;
  message: string;
  user?: User;
  preferredLan: string;
  currentLan: string;
  currentLanOptions: { text: string; value: string}[];
  code: string;
}
export interface GameMethods {
  fetchList: () => void;
  reset: () => void;
  fetchCodes: () => void;
  setPreferredLan: (lan: string) => void;
  next: () => void;
  submit: (ans: string) => void;
  changeLan: (lan: string) => void;
}

