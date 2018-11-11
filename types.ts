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

export const defaultLan = 'c++';

export interface RootAction extends Action {
  [key: string]: any;
}


// Home
export interface HomeProps {
  loadingUI: boolean;
  user?: User;
}
export interface HomeMethods {
  startUI: () => void;
}


// Game
export interface GameProps {
  status: Status;
  options: Array<{ name: string; id: string }>;
  message: string;
  user?: User
}
export interface GameMethods {
  fetchList: () => void;
  fetchCodes: () => void;
  setPreferredLan: (lan: string) => void;
  next: () => void;
  submit: (ans: string) => void;
}

// CodePanel
export interface CodePanelProps {
  code: string;
  availableLans: string[];
  currentLan: string;
}
export interface CodePanelMethods {
  changeLan: (lan: string) => void;
}
