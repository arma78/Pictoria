import * as React from "react";
import { IPictoriaProps } from "./IPictoriaProps";
import { IArticleNewsWpState } from "./IArticleNewsWpState";
import { IField, IFieldAddResult, IFields } from "@pnp/sp/fields/types";
import { FieldUserSelectionMode } from "@pnp/sp/fields/types";
import * as moment from 'moment';
import styles from "./ArticleNewsWp.module.scss";
import { sp } from "@pnp/sp";
import "@pnp/sp/content-types/list";
import "@pnp/sp/content-types";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/features";
import "@pnp/sp/site-users/web";
import "@pnp/sp/folders";
import "@pnp/sp/clientside-pages/web";
import "@pnp/sp/comments/clientside-page";
import { Icon } from "office-ui-fabric-react/lib/Icon";
import {Dialog, DialogFooter} from "office-ui-fabric-react/lib/Dialog";
import { Label } from "office-ui-fabric-react/lib/Label";
import {  DefaultButton, PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { Web } from "sp-pnp-js";
import { getDetailView, viewSelector, getPictoriaFieldState} from '../state/actions';
import CardsView from './CardsView';
const spinner1: any = require('./assets/small.gif');
export default class ArticleNewsWp extends React.Component<IPictoriaProps, IArticleNewsWpState> {



  constructor(props:IPictoriaProps, state:IArticleNewsWpState) {

    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = ({siteurl: this.props.siteurl,
         hideDialog3:true,
         allowUpdate:false,
         SpinnerShowHide:"none",
         items:[],
         spHttpClient: this.props.spHttpClient,newsCardserror:"none",errorstatus:0
        });
   }

  public async componentDidMount(): Promise<void> {
    if (Boolean(this.props.listName2)) {
        await this.VerifyContentFieldExist();
        if (this.state.allowUpdate == true) {
          this.setState({ hideDialog3: false });
        }

      this._getNewsFeed();
      this.setState({ newsCardserror: "none" });
    }
    else {
      this.setState({ newsCardserror: "block" });
    }
  }
  // tslint:disable-next-line:typedef
  public async componentDidUpdate(prevProps, prevState) {
    if (this.props.listName2 !== prevProps.listName2) {
        await this.VerifyContentFieldExist();
        if (this.state.allowUpdate == true) {
          this.setState({ hideDialog3: false });
        }
    }
    if (this.props.NewsCounter !== prevProps.NewsCounter ||
        this.props.listName2 !== prevProps.listName2 ||
        this.props.CharCounter !== prevProps.CharCounter) {
        this._getNewsFeed();
    }
  }


    private _closeDialog3() {
      this.setState({hideDialog3:true}) ;
    }
    private async _AddField()

    {
      let MessageField:string = "";

            if (this.state.allowUpdate == false) {
        console.log("Card content, Copyright and Author fields found!");
      }
      else
      {
        this.setState({SpinnerShowHide:"block"});
        let fieldexist: string = "";
        const field: any[] = await sp.web.lists.getById(this.props.listName2.id).fields.get();
        let internalname: string = "";
        for (let index = 0; index < field.length; index++) {
          internalname = field[index].InternalName;
          if (internalname === "Card_x0020_Content") {
            fieldexist = "bingo";
          }
        }
          if (fieldexist !== "bingo") {
            await sp.web.lists.getById(this.props.listName2.id).fields.createFieldAsXml(`<Field Type="HTML" SourceID='http://schemas.microsoft.com/sharepoint/v3' Name="Card_x0020_Content" DisplayName="Card Content" Required="{TRUE|FALSE}"  RichText='TRUE'
            RichTextMode='FullHtml' AllowEmbedding='TRUE' AllowInsert='TRUE' />`);
            await sp.web.lists.getById(this.props.listName2.id).fields.getByTitle("Card Content").setShowInDisplayForm(true);
            await sp.web.lists.getById(this.props.listName2.id).fields.getByTitle("Card Content").setShowInNewForm(true);
            await sp.web.lists.getById(this.props.listName2.id).fields.getByTitle("Card Content").setShowInEditForm(true);

            MessageField += "'Card Content'";
           }

          let imagectfound:boolean = false;
          const listcheck = sp.web.lists.getByTitle(this.props.listName2.title);
          const r = await listcheck.contentTypes();
          for (let ct = 0; ct < r.length; ct++) {
            if(r[ct].StringId === "0x0101009148F5A04DDD49CBA7127AADA5FB792B00AADE34325A8B49CDA8BB4DB53328F2140052744C2F180C0448B78F82EE9CE0C748")
            {
              imagectfound = true;
            }
          }

        if (imagectfound == false) {

          let fieldexist2: string = "";
          const field2: any[] = await sp.web.lists.getById(this.props.listName2.id).fields.get();
          let internalname2: string = "";
          for (let index2 = 0; index2 < field2.length; index2++) {
            internalname2 = field2[index2].InternalName;
            if (internalname2 === "Image_Copyright" || internalname2 === "wic_System_Copyright") {
              fieldexist2 = "bingo2";
            }
          }
          if (fieldexist2 !== "bingo2") {

            await sp.web.lists.getById(this.props.listName2.id).fields.addText("Image_Copyright", 255, { Group: "Pictoria" });
            await sp.web.lists.getById(this.props.listName2.id).fields.getByTitle("Image_Copyright").setShowInDisplayForm(true);
            await sp.web.lists.getById(this.props.listName2.id).fields.getByTitle("Image_Copyright").setShowInNewForm(true);
            await sp.web.lists.getById(this.props.listName2.id).fields.getByTitle("Image_Copyright").setShowInEditForm(true);
            MessageField += ", 'Image_Copyright'";
           }
          let fieldexist3: string = "";
          const field3: any[] = await sp.web.lists.getById(this.props.listName2.id).fields.get();
          let internalname3: string = "";
          for (let index3 = 0; index3 < field3.length; index3++) {
            internalname3 = field3[index3].InternalName;
            if (internalname3 === "Image_Author" || internalname3 === "_Author") {
              fieldexist3 = "bingo3";
            }
          }
          if (fieldexist3 !== "bingo3") {

            await sp.web.lists.getById(this.props.listName2.id).fields.addText("Image_Author", 255, { Group: "Pictoria" });
            await sp.web.lists.getById(this.props.listName2.id).fields.getByTitle("Image_Author").setShowInDisplayForm(true);
            await sp.web.lists.getById(this.props.listName2.id).fields.getByTitle("Image_Author").setShowInNewForm(true);
            await sp.web.lists.getById(this.props.listName2.id).fields.getByTitle("Image_Author").setShowInEditForm(true);
            MessageField += ", 'Image_Author'";
           }


          let fieldexist4: string = "";
          const field4: any[] = await sp.web.lists.getById(this.props.listName2.id).fields.get();
          let internalname4: string = "";
          for (let index4 = 0; index4 < field4.length; index4++) {
            internalname4 = field4[index4].InternalName;
            if (internalname4 === "LikedBy") {
              fieldexist4 = "bingo4";
            }
          }
          if (fieldexist4 !== "bingo4") {
         await sp.web.lists.getById(this.props.listName2.id)
         .fields.createFieldAsXml(`<Field Type="UserMulti" Hidden="TRUE" Mult="TRUE" Name="LikedBy" DisplayName="LikedBy" UserSelectionMode="0" UserSelectionScope="0" SourceID="http://schemas.microsoft.com/sharepoint/v3" Group="Pictoria" />`);
         MessageField += ", 'LikedBy'";
          }


          let fieldexist5: string = "";
          const field5: any[] = await sp.web.lists.getById(this.props.listName2.id).fields.get();
          let internalname5: string = "";
          for (let index5 = 0; index5 < field5.length; index5++) {
            internalname4 = field5[index5].InternalName;
            if (internalname5 === "LikesCount") {
              fieldexist5 = "bingo5";
            }
          }
          if (fieldexist5 !== "bingo5") {
            await sp.web.lists.getById(this.props.listName2.id).fields.createFieldAsXml(`<Field Type="Number" Name="LikesCount" DisplayName="LikesCount" Min="0"
            Max="10000" Decimals="0" Group="Pictoria" />`);
            await sp.web.lists.getById(this.props.listName2.id).fields.getByTitle("LikesCount").setShowInNewForm(false);
            await sp.web.lists.getById(this.props.listName2.id).fields.getByTitle("LikesCount").setShowInEditForm(false);
            MessageField += ", 'LikesCount'";
         }
        }
        this.setState({SpinnerShowHide:"none"});
        alert(MessageField + " field was added into " + this.props.listName2.title + " library");
       }
      this.setState({allowUpdate:false,hideDialog3:true});
    }
    private async VerifyContentFieldExist() {

      let imagectfound:boolean = false;
      const listcheck = sp.web.lists.getByTitle(this.props.listName2.title);
      const r = await listcheck.contentTypes();
      for (let ct = 0; ct < r.length; ct++) {
        if(r[ct].StringId === "0x0101009148F5A04DDD49CBA7127AADA5FB792B00AADE34325A8B49CDA8BB4DB53328F2140052744C2F180C0448B78F82EE9CE0C748" ||
        r[ct].StringId === "0x0101009148F5A04DDD49CBA7127AADA5FB792B00AADE34325A8B49CDA8BB4DB53328F21400A695A789582A5B4B81600E42EF810A2A")
        {
          imagectfound = true;
        }
      }

    if (imagectfound === false) {
      let store = this.props.store;
      store.dispatch(getPictoriaFieldState("Notfound"));
      //update redux state
    }

      let fieldexist:string = "";
      const field : any[] = await sp.web.lists.getById(this.props.listName2.id).fields.get();
      let internalname:string = "";
      for (let index = 0; index < field.length; index++) {
        internalname = field[index].InternalName;

         if(internalname === "Card_x0020_Content") {
            fieldexist = "bingo";
         }
       }

      if(fieldexist === "bingo"){
        this.setState({allowUpdate:false});
      }
      else {
        this.setState({allowUpdate:true});
      }
    }

  public render(): React.ReactElement<IPictoriaProps> {




    if(Boolean(this.props.listName2) && this.state.errorstatus == 0)
    {

      return (
        <div className="ArticleNewsWp">

         <h3>{this.props.title}</h3>
         {this.state.items.length && this.state.items.map((item, index) => {
             let store = this.props.store;
             let CTfound = store.getState().CTfound;
             var CH: number = +this.props.CharCounter;
             var finalArticle = "";
             var itemstringArticle = "";
             itemstringArticle = item.ListItemAllFields.Card_x0020_Content;
             if(Boolean(itemstringArticle)) {
              itemstringArticle = itemstringArticle;
             }
             else {
              itemstringArticle = "<div>No Content Added Yet.</div>";
             }

             // tslint:disable-next-line:no-shadowed-variable
             function strip(itemstringArticle) {
               var resRndrArticle = new DOMParser().parseFromString(itemstringArticle, "text/html");
               return resRndrArticle.body.textContent || "";
             }

              finalArticle = strip(itemstringArticle);
              finalArticle = finalArticle.substring(0, CH);


            var img = this.props.listName2.url + "/" + item.Name;
            return (


              <div key={index} className={styles.stapler} style={{ background: this.props.newsCardBgColor }}>
                <div className={styles.NewsLeft}>
                  <img className={styles.newsimage} src={img} alt={item.Title} />
                  <p style={{fontSize:"9px"}}><b>&nbsp;&nbsp;&nbsp;{CTfound === "Notfound" ? item.ListItemAllFields.Image_Copyright : item.ListItemAllFields.wic_System_Copyright}</b></p>
                </div>
                <div className={styles.NewsRight}>
                  <ul className={styles.nobullets}>
                    <li><b>{item.Title}</b></li>
                    <li><p>{finalArticle}
                      <b className={styles.Rm} onClick={(event) => this._redirectToPage(event, item.ListItemAllFields.Id)}>[... More]</b></p></li>
                    <li><b>Likes Count: </b>
                      <Icon iconName="LikeSolid" /> {item.ListItemAllFields.LikesCount}</li>
                    <li><b>Published Date: </b> {moment(item.ListItemAllFields.Created).format("YYYY-MM-DD HH:mm")}</li>
                    <li><b>Author: </b> {CTfound === "Notfound" ? item.ListItemAllFields.Image_Author : item.ListItemAllFields.OData__Author}</li>
                  </ul>
                </div>
              </div>
              );





            })




          }

          <div>
            <Dialog hidden={this.state.hideDialog3} onDismiss={this._closeDialog3}>
            <Label><h3><b>PICTORIA UPDATE NOTICE</b></h3></Label>

              <Label>This Web Part needs to add 'Card Content' field into your {this.props.listName2.title} library.</Label>
              <br></br>
              <Label>If you agree, please click 'Proceed with adding'.</Label>
              <img src={require('../components/assets/small.gif')} style={{ display: this.state.SpinnerShowHide, maxHeight:"38px"}} alt="" />
              <DialogFooter>
                <PrimaryButton onClick={this._AddField.bind(this)} text="Proceed with adding" />
                <DefaultButton onClick={this._closeDialog3.bind(this)} text="Cancel" />
              </DialogFooter>
            </Dialog>
          </div>


        </div>


      );
     }
      else {
       return (<div style={{ display: this.state.newsCardserror,color:"red" }} >
         <h2><ul>
           <li>Go to edit mode, and select your image library.</li>
           <li>Press "Apply" button.</li>
            </ul>
         </h2></div>);

     }
  }



  // tslint:disable-next-line:typedef
  private _redirectToPage(event, itemId:string) {
    let store = this.props.store;

    store.dispatch(getDetailView(itemId));
    store.dispatch(viewSelector("CardsView"));

    // location.href = "#/CardsView/" + itemId;
    return <CardsView {...this.props}/>;
  }


  private async _getNewsFeed() {

    let SHAREPOINT_MAX: number;
    if(Boolean(this.props.NewsCounter))
    {
    SHAREPOINT_MAX = +this.props.NewsCounter;
    }
    else {
    SHAREPOINT_MAX = 4;
    }

    const myweb = new Web(this.props.context.pageContext.web.absoluteUrl);
    const allItems: any[] = await myweb.getFolderByServerRelativeUrl(this.props.listName2.url)
    .files
    .expand("ListItemAllFields,Author, Files/ListItemAllFields")
    .top(SHAREPOINT_MAX)
    .orderBy("ListItemAllFields/Created", false)
    .get();

    this.setState({ items: allItems });
  }

}
