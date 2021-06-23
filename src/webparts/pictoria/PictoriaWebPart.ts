import * as React from "react";
import * as ReactDom from "react-dom";
import { IPropertyFieldList, PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import { SPHttpClient } from '@microsoft/sp-http';
import {
  BaseClientSideWebPart,
  WebPartContext,

} from "@microsoft/sp-webpart-base";
//Import from Redux so the store can be created
//Import the reducer function
import { createStore, Store } from 'redux';
import { IApplicationState } from './state/reducers';
import reducer from './state/reducers';

import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneToggle,

} from "@microsoft/sp-property-pane";

import { PropertyFieldColorPicker, PropertyFieldColorPickerStyle } from '@pnp/spfx-property-controls/lib/PropertyFieldColorPicker';
import * as strings from "PictoriaWebPartStrings";
import Pictoria from "./components/Pictoria";
import { IPictoriaProps } from "./components/IPictoriaProps";

export interface IPropertyControlsTestWebPartProps {
  lists: string | string[]; // Stores the list ID(s)
}
export interface IPropertyControlsTestWebPartProps {
  color: string;
}

export interface IPictoriaWebPartProps {
  description: string;
  listName: string;
  siteurl: string;
  spHttpClient: SPHttpClient;
  title: string;
  title2: string;
  NewsCounter: number;
  CharCounter: string;
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
}

export default class PictoriaWebPart extends BaseClientSideWebPart<IPictoriaWebPartProps> {
 //member variable for the store
 private store: Store<IApplicationState>;

 protected onInit():Promise<void>{

   //create the store instance
   this.store = createStore(reducer);
   this.store.subscribe(this.render);
   this.getStore = this.getStore.bind(this);

   return super.onInit();

 }

  public render(): void {
    const element: React.ReactElement<IPictoriaProps > = React.createElement(
      Pictoria,
      {
        title: this.properties.title,
        title2: this.properties.title2,
        description: this.properties.description,
        listName: this.properties.listName,
        NewsCounter: this.properties.NewsCounter,
        CharCounter: this.properties.CharCounter,
        spHttpClient: this.properties.spHttpClient,
        siteurl: this.context.pageContext.web.absoluteUrl,
        showThumbs: this.properties.showThumbs,
        autoPlay: this.properties.autoPlay,
        infiniteLoop: this.properties.infiniteLoop,
        interval: this.properties.interval,
        showArrows: this.properties.showArrows,
        showStatus: this.properties.showStatus,
        swipeable: this.properties.swipeable,
        stopOnHover: this.properties.stopOnHover,
        showIndicators: this.properties.showIndicators,
        transitionTime: this.properties.transitionTime,
        newsCardBgColor: this.properties.newsCardBgColor,
        listName2: this.properties.listName2,
        SlideCounter: this.properties.SlideCounter,
        showLegend: this.properties.showLegend,
        maxWidth: this.properties.maxWidth,
        maxHeight: this.properties.maxHeight,
        context: this.context,
        navmenuitem1:this.properties.navmenuitem1,
        navmenuitem2:this.properties.navmenuitem2,
        store: this.getStore() //pass the store in the component properties
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  private getStore(): Store<IApplicationState>{
    return this.store;
  }

  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {

    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: "Image Slider Settings",
              groupFields:
              [
                PropertyPaneTextField("navmenuitem1", {
                  label: strings.navmenuitem1FieldLabel,
                  value: "Cards",
                  maxLength:20
                }),
                PropertyPaneTextField("navmenuitem2", {
                  label: strings.navmenuitem2FieldLabel,
                  value:"Image Slider",
                  maxLength:20
                }),
                PropertyPaneTextField("title2", {
                  label: strings.TitleFieldLabel2,
                  maxLength:40
                }),

                PropertyPaneToggle("showThumbs", {
                label: strings.showThumbsFieldLabel,
                checked: true,
                onText: "Toggle is On", offText:"Toggle is Off"
              }),
               PropertyPaneToggle("autoPlay", {
                label: strings.autoPlayFieldLabel,
                checked: true,
                onText: "Toggle is On", offText:"Toggle is Off"
              }),
               PropertyPaneToggle("showArrows", {
                label: strings.showArrowsFieldLabel,
                checked: true,
                onText: "Toggle is On", offText:"Toggle is Off"
              }),
              PropertyPaneToggle("showLegend", {
                label: strings.showLegendFieldLabel,
                checked: true,
                onText: "Toggle is On", offText:"Toggle is Off"
              }),
               PropertyPaneToggle("showStatus", {
                label: strings.showStatusFieldLabel,
                checked: true,
                onText: "Toggle is On", offText:"Toggle is Off"
              }),
              PropertyPaneToggle("stopOnHover", {
                label: strings.stopOnHoverFieldLabel,
                checked: true,
                onText: "Toggle is On", offText:"Toggle is Off"
              }),
               PropertyPaneToggle("showIndicators", {
                label: strings.showIndicatorsFieldLabel,
                checked: true,
                onText: "Toggle is On", offText:"Toggle is Off"
              }),
               PropertyPaneToggle("infiniteLoop", {
                label: strings.infiniteLoopFieldLabel,
                checked: true,
                onText: "Toggle is On", offText:"Toggle is Off"
              }),
              PropertyPaneToggle("swipeable", {
                label: strings.swipeableFieldLabel,
                checked: true,
                onText: "Toggle is On", offText:"Toggle is Off"
              }),

              PropertyFieldListPicker('listName2', {
                label: 'Select your image library',
                includeHidden: false,
                orderBy: PropertyFieldListPickerOrderBy.Title,
                disabled: false,
                onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                properties: this.properties,
                includeListTitleAndUrl:true,
                context: this.context,
                listsToExclude:["Reusable Content","Categories","Site Collection Documents","Content and Structure Reports", "Community Members","Style Library", "Workflow Tasks","Discussions List","Documents","Form Templates", "Events","Pages","Site Pages"],
                selectedList:this.properties.listName2,
                onGetErrorMessage: null,
                deferredValidationTime: 0,
                key: 'listPickerFieldId'
              }),

              PropertyPaneSlider("SlideCounter", {
                label: strings.SlideCounterFieldLabel,
                min: 0,
                value: 16,
                max: 38,
              }),
              PropertyPaneSlider("interval", {
                label: strings.intervalFieldLabel,
                min: 1000,
                max: 10000,
                step: 500,
                value: 3000,
               }),
               PropertyPaneSlider("transitionTime", {
                label: strings.transitionTimeFieldLabel,
                min: 500,
                max: 3000,
                step: 500,
                value: 500,
               }),
               PropertyPaneSlider("maxHeight", {
                label: strings.maxHeightFieldLabel,
                min: 80,
                max: 1600,
                step: 10,
                value: 480,
               }),
               PropertyPaneSlider("maxWidth", {
                label: strings.maxWidthFieldLabel,
                min: 100,
                max: 2000,
                step: 10,
                value: 800,
               }),
              ],
            },
            {
              groupName: "Card Settings",
              groupFields:
               [
                PropertyPaneTextField("title", {
                  label: strings.TitleFieldLabel,
                }),
                PropertyPaneSlider("NewsCounter", {
                  label: strings.NewsCounterFieldLabel,
                  min: 1,
                  value: 4,
                  max: 60,
                }),
                PropertyPaneSlider("CharCounter", {
                  label: strings.CharCounterFieldLabel,
                  min: 50,
                  max: 2000,
                  step: 50,
                  value: 200,
                 }),
                 PropertyFieldColorPicker('newsCardBgColor', {
                  label: 'Color',
                  selectedColor: this.properties.newsCardBgColor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  disabled: false,
                  isHidden: false,
                  alphaSliderHidden: false,
                  style: PropertyFieldColorPickerStyle.Full,
                  iconName: 'Precipitation',
                  key: 'colorFieldId'
                })
              ],
              isCollapsed: false
            },
          ]
        }
      ]
    };
  }
}
