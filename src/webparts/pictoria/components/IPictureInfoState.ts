import { IUser } from "../services/IUser";
import {IListService } from "../services/IListService";
import {IListKeywords } from "../services/IListKeywords";

import {SPHttpClient} from "@microsoft/sp-http";
export interface IPictureInfoState {
  navigate: boolean;
  items: IListService[];
  Kitems: IListKeywords[];
  LikedUsers: IUser[];
  active: string;
  idu: string;
  titlu : string;
  keywordsu : string;
  selectedKeyword:string;
  siteurl: string;
  spHttpClient: SPHttpClient;
  showKey:boolean;
  hideDialog: boolean;
  hideDialogLikedby: boolean;
  imagelikedTitle: string;
  errormsg:string;
  errorstatus:number;
  authtoupdate:string;
}
