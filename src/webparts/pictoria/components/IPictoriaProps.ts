import { WebPartContext } from "@microsoft/sp-webpart-base";
import {SPHttpClient, } from "@microsoft/sp-http";
import { IPropertyFieldList } from "@pnp/spfx-property-controls/lib/PropertyFieldListPicker";
import { Store } from 'redux';
import { IApplicationState } from '../state/reducers';


export interface IPictoriaProps {
  listName: string;
  description: string;
  siteurl: string;
  title: string;
  title2: string;
  NewsCounter: number;
  CharCounter: string;
  spHttpClient: SPHttpClient;
  showThumbs:boolean;
  autoPlay:boolean;
  infiniteLoop:boolean;
  interval:number;
  showArrows:boolean;
  showStatus:boolean;
  swipeable:boolean;
  stopOnHover:boolean;
  showIndicators:boolean;
  transitionTime:number;
  newsCardBgColor:string;
  listName2: IPropertyFieldList;
  SlideCounter: number;
  showLegend:boolean;
  maxWidth:string;
  maxHeight:string;
  context:WebPartContext;
  navmenuitem1:string;
  navmenuitem2:string;
  store: Store<IApplicationState>;
}
