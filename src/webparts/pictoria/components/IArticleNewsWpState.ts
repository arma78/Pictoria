import {SPHttpClient} from "@microsoft/sp-http";
export interface  IArticleNewsWpState {
items: any[];
siteurl: string;
spHttpClient: SPHttpClient;
newsCardserror: string;
errorstatus:number;
hideDialog3:boolean;
allowUpdate:boolean;
SpinnerShowHide:string;
}

