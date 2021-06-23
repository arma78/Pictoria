import * as React from "react";
import styles from "./PictureInfo.module.scss";
import { IPictureInfoState } from "./IPictureInfoState";
import { IPictoriaProps} from "./IPictoriaProps";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { IListService } from "../services/IListService";
import { IListKeywords } from "../services/IListKeywords";
import { IUser } from "../services/IUser";
import { ILike } from "../services/ILike";
import pnp, {UserProfile, sp, Item, ItemUpdateResult, Web } from "sp-pnp-js";
import "@pnp/sp/site-users/web";
import "@pnp/sp/webs";

import { Dialog, DialogFooter } from "office-ui-fabric-react/lib/Dialog";
import { PrimaryButton, DefaultButton } from "office-ui-fabric-react/lib/Button";
import { Label } from "office-ui-fabric-react/lib/Label";
import { Icon } from "office-ui-fabric-react/lib/Icon";
import { Persona } from "office-ui-fabric-react/lib/Persona";






class PictureInfo extends React.Component<IPictoriaProps, IPictureInfoState> {
   constructor(props: IPictoriaProps, state:IPictureInfoState) {
       super(props);
       pnp.setup({
        sp: {
          headers: {
            "Accept": "application/json;odata=minimalmetadata"
          },

        }
      });



       this.state = {navigate: false,active:null,showKey:false, selectedKeyword:"",
       items: [],Kitems:[],LikedUsers:[], idu : "", titlu : "", keywordsu : "",hideDialog: true,
       hideDialogLikedby:true, siteurl: this.props.siteurl,
       spHttpClient: this.props.spHttpClient,
       imagelikedTitle:"", errormsg:"none",errorstatus:0,authtoupdate:"disalowed"

      };

  }




  public componentDidMount(): void {

    if(Boolean(this.props.listName2))
     {
        this._getKeywords().then((result: Array<IListKeywords>) => {
          this.setState({ Kitems: result });
        });
        this._getSlides().then((result: Array<IListService>) => {
          this.setState({ navigate: false, selectedKeyword: "", items: result, idu: "", titlu: "", keywordsu: "",errormsg:"none" });
        });
        this._myValidation();
     }
     else {
      this.setState({errormsg:"block"});
     }
  }
  // tslint:disable-next-line:typedef
  public componentDidUpdate(prevProps, prevState) {

    if (this.props.listName2 !== prevProps.listName2 || this.props.SlideCounter !== prevProps.SlideCounter)
      {

        this._getSlides().then((result: Array<IListService>) => {
          this.setState({ items: result, active:null });
        });
        this._getKeywords().then((result: Array<IListKeywords>) => {
          this.setState({ Kitems: result, active:null });
        });

      }
      if (this.state.selectedKeyword !== "") {
        this._getSlides().then((result: Array<IListService>) => {
        this.setState({ items: result });
      });
    }



  }
  public render(): React.ReactElement<IPictoriaProps> {
    if(Boolean(this.props.listName2) && this.state.errorstatus == 0)
    {

    return (

      <div className={styles.PictureInfo} >
        <h3>{this.props.title2}</h3>
        {this.state.Kitems.length && this.state.Kitems.map((listItemT, index) => {

         return (
            <div className={styles.keywordsDiv} style={{ display: this._myKeywordsDiv() }}>
                    <span key={index} id={index.toString()}
                            style={{ background: this._myColor(index),pointerEvents: this._DisableClick(index) }}
                            className={styles.KW} onClick={(event) => this._filterbyKeyword(event, listItemT.Keywords, index)}>
                              {listItemT.Keywords}</span>
            </div>
          );

        })}
        <div>
        <span className={styles.KW} style={{ background: this._myColorShowAll() }} onClick={(event) => this._ShowAll(event)}>Show All</span>
        <span className={styles.PopBcg}><input className={styles.PopBcg}
         type="checkbox" onChange={(event) =>this.toggleChange(event)} checked={this.state.showKey}/> Show/Hide Keywords</span>
        </div>
        <Carousel
          width={this.props.maxWidth}
          showThumbs={this.props.showThumbs}
          autoPlay={this.props.autoPlay}
          infiniteLoop={this.props.infiniteLoop}
          interval={this.props.interval}
          showArrows={this.props.showArrows}
          showStatus={this.props.showStatus}
          swipeable={this.props.swipeable}
          stopOnHover={this.props.stopOnHover}
          showIndicators={this.props.showIndicators}
          transitionTime={this.props.transitionTime}>
          {this.state.items.length && this.state.items.map((listItem, index) => {

            return (
              <div>
                <img key={index} src={listItem.EncodedAbsUrl} style={{maxHeight: this._mymaxHeight()}}/>
                <p style={{display: this._myLegendDiv()}} className="legend">
                  <b className={styles.Rm} style={{pointerEvents:"auto"}}
                  onClick={(event) => this._redirectToPage(event, listItem.Id, listItem.Title, listItem.Keywords)}>
                    Title: {listItem.Title}</b>
                  <br></br>
                  <b className={styles.Lk} onClick={(event) => this._getLikedBy(event, listItem.Id, listItem.Title)}>
                    Liked By:<Icon iconName="People"></Icon></b>
                  <br></br>
                  <b className={styles.Lk}><Icon iconName="LikeSolid" className={styles.likePic}
                   onClick={(event) => this._getPicLikes(event, listItem.Id)}/>
                   {listItem.LikesCount}</b><b className={styles.Rmc}>Keywords: {listItem.Keywords}</b>
                </p>

              </div>);
          })}

        </Carousel>
        <div>
        <Dialog hidden={this.state.hideDialog} onDismiss={this._closeDialog}>
        <Label>Update Image Keywords and Title</Label>
        <br></br>
        <Label>Item Id:</Label>
        <input type="text" id="upId" name="ID" disabled={true} value={this.state.idu}/>
        <br></br>
        <Label>Title:</Label>
        <input type="text" id="upTitle" name="titlu" value={this.state.titlu} onChange={this._titlehandleChange.bind(this)} />
        <br></br>
        <Label>Keywords:</Label>
        <input type="text" id="upKeywords" name="keywordsu"  value={this.state.keywordsu}
        onChange={this._keywordshandleChange.bind(this)} />
          <DialogFooter>
            <PrimaryButton onClick={this._updateContent.bind(this)} text="Save" />
            <DefaultButton onClick={this._closeDialog} text="Cancel" />
          </DialogFooter>
      </Dialog>

    </div>

    <div>
        <Dialog hidden={this.state.hideDialogLikedby}
         onDismiss={this._closeDialogForLikedby}>
        <Label><h3>{this.state.imagelikedTitle} Image was liked by following users:</h3></Label>
        <br></br>
        {this.state.LikedUsers.length && this.state.LikedUsers.map((lt, index) => {
            return (
                <div>
                  <div key={index} className={styles.row}>
                      <Persona initialsColor="blue"
                        imageUrl={lt.UserImage}
                        primaryText={lt.Name}
                        secondaryText={lt.Email}
                        color={"blue"} coinSize={40} />
                  </div>
                </div>);
          })}
           <DialogFooter>
            <PrimaryButton onClick={this._closeDialogForLikedby} text="Close" />
          </DialogFooter>
      </Dialog>
    </div>
      </div>
    );
  }
  else{
   return (<div style={{ display: this.state.errormsg,color:"red" }} >
     <h2>
     <ul>
           <li>Go to edit mode, and select your image library.</li>
           <li>Press "Apply" button.</li>
           </ul>
           </h2></div>);

  }

  }

  // tslint:disable-next-line:typedef
  public _DisableClick(index) {
    if (this.state.active === index) {
      return "none";
    }
    return "auto";

  }



  // tslint:disable-next-line:typedef
  public _myValidation() {
    this._AuthorizedToUpdate().then(res => {
         if(res === "bingo") {
          this.setState({authtoupdate:"alowed"});
        } else {
          this.setState({authtoupdate:"disalowed"});
        }
      });
    }

  // tslint:disable-next-line:typedef
  private async _AuthorizedToUpdate(): Promise<string> {
    // tslint:disable-next-line:typedef
    let myweb = new Web(this.props.context.pageContext.web.absoluteUrl);
    let currUserID = "";
    this._getUserId().then(res => { currUserID = res.toString(); });
      // tslint:disable-next-line:typedef
      const memberGroup = await myweb.associatedOwnerGroup.get();
      // get all users of group
      // tslint:disable-next-line:typedef
      const groupID = memberGroup.Id;
      // tslint:disable-next-line:typedef
      const usersd = await myweb.siteGroups.getById(groupID).users.get();
      var userauth = "";

      // tslint:disable-next-line:typedef
      for (let index = 0; index < usersd.length; index++) {
        if((usersd[index].Id).toString() === currUserID) {
         userauth = "bingo";
        }
      }
      return  userauth;
  }

  // tslint:disable-next-line:typedef
  private _titlehandleChange(event) {
    this.setState({titlu: event.target.value });
  }
   private _closeDialog = (): void => {
    this.setState({ hideDialog: true });
  }
  private _closeDialogForLikedby = (): void => {
    this.setState({ hideDialogLikedby: true });
  }
  // tslint:disable-next-line:typedef
  private _ShowAll(event) {
    this._getSlides().then((result: Array<IListService>) => {
    this.setState({ items: result, active:null });
    });
    this._getKeywords().then((result: Array<IListKeywords>) => {
      this.setState({ Kitems: result, active:null });
    });
  }
  // tslint:disable-next-line:typedef
  private _myLegendDiv() {
    if (this.props.showLegend === false) {
      return "none";
    } else if (this.props.showLegend === true) {
      return "block";
    }
    return "";
  }
  // tslint:disable-next-line:typedef
  private _mymaxHeight() {
    if (this.props.maxHeight !== "" || this.props.maxHeight !== null) {
      return this.props.maxHeight;
    }
  }

  // tslint:disable-next-line:typedef
  private toggleChange(e) {
    this.setState({
      showKey: e.target.checked
    });
  }
 // tslint:disable-next-line:typedef
 private  _myKeywordsDiv() {
    if (this.state.showKey === false) {
      return "none";
    } else if (this.state.showKey === true) {
      return "block";
    }
    return "";
  }
  // tslint:disable-next-line:typedef
  private _myColor(index) {
    if (this.state.active === index) {
      return "#7e159e";
    }
    return "#0078D4";
  }
  // tslint:disable-next-line:typedef
  private _myColorShowAll() {
    if (this.state.active === null) {
      return "#7e159e";
    } else if (this.state.active !== null) {
    return "#0078D4";
    }
    return "";
  }
  // tslint:disable-next-line:typedef
  private _keywordshandleChange(event) {
    this.setState({ keywordsu: event.target.value });
  }
  // tslint:disable-next-line:typedef
  private _redirectToPage(event, pid: string, title: string, keyword: string) {
    this.setState({ idu: pid, titlu: title, keywordsu: keyword, navigate: true,hideDialog: false});
  }
  // tslint:disable-next-line:typedef
  private _filterbyKeyword(event, keywordName, index) {
    this.setState({ selectedKeyword: keywordName });
    if (this.state.active === index) {
      this.setState({ active:null });
    } else {
      this.setState({ active: index });
    }
  }
  // tslint:disable-next-line:typedef
  private  _updateContent() {

  if (this.state.authtoupdate === "alowed")
     {
    try {

      // tslint:disable-next-line:typedef
      let myweb = new Web(this.props.context.pageContext.web.absoluteUrl);
      let etag: string = undefined;
      // tslint:disable-next-line:typedef
      let uid = +this.state.idu;
      myweb.lists.getById(this.props.listName2.id).items.getById(uid).get(undefined, {
        headers:
        {
          // tslint:disable-next-line:quotemark
          'Accept': 'application/json;odata=minimalmetadata'
        }
      }).then((item: Item): Promise<IListService> => {
        etag = item["odata.etag"];
        return Promise.resolve((item as any) as IListService);
      }).then((item: IListService): Promise<ItemUpdateResult> => {
        return  myweb.lists.getById(this.props.listName2.id)
          .items.getById(uid).update({
            Title: this.state.titlu,
            Keywords: this.state.keywordsu
          }, etag);
      })
      .then((): void => {
          this.setState({ idu: "", titlu: "", keywordsu: "", hideDialog: true });
          // tslint:disable-next-line:no-shadowed-variable
          this._getSlides().then((result: Array<IListService>) => {
            this.setState({ items: result, active:null });
          });
          // tslint:disable-next-line:no-shadowed-variable
          this._getKeywords().then((result: Array<IListKeywords>) => {
            this.setState({ Kitems: result, active:null });
          });
      }, (error: any): void => {
        if (error.status == 403){
         alert("You are not authorized to update list items!  Only members of the 'Site Owners Group' can do the updates!");
        }
        else {
        alert("Failed to update list item!");
        }
      });
    } catch (e) {
      console.log(e.status);
    }
  }
  else {
    alert("You are not authorized to update this list item!  Only members of the 'Site Owners Group' can commit this update!");
  }

  }

  private _getSlides(options?: any): Promise<IListService[]> {

    return new Promise<IListService[]>((resolve:(any) => void, reject: (error: any) => void): void => {
      // tslint:disable-next-line:typedef
      if(Boolean(this.props.listName2)){

      let myweb = new Web(this.props.context.pageContext.web.absoluteUrl);
      var SHAREPOINT_LIST: string = this.props.listName2.id;


      if (this.state.selectedKeyword !== "") {
        this._myColorShowAll();
        // tslint:disable-next-line:typedef
        var skw = this.state.selectedKeyword.toString();
        // tslint:disable-next-line:max-line-length
        myweb.lists.getById(SHAREPOINT_LIST).getItemsByCAMLQuery({ ViewXml: "<View><ViewFields><FieldRef Name='EncodedAbsUrl'/><FieldRef Name='Keywords' /><FieldRef Name='LikesCount' /><FieldRef Name='Id' /><FieldRef Name='Title' /></ViewFields><Query><Where><Contains><FieldRef Name='Keywords'/><Value Type='Text'>" + skw + "</Value></Contains></Where></Query><QueryOptions><ViewAttributes Scope='RecursiveAll'/></QueryOptions></View>" }, "EncodedAbsUrl")
          .then((items: any[]) => {
            resolve(items);
              if (items.length == 0) {
                resolve(-1);
              }
              else if (items.length > 0)
              {
                this.setState({ items: items, selectedKeyword:"", errormsg:"none",errorstatus:0 });
              }
          }, (error: any): void => {
            this.setState({ errormsg:"block" });
            if(error.status == 404 || error.status == 400)
            {
              this.setState({errorstatus:error.status});
            }

            reject(error);
          });
      } else {


        let SHAREPOINT_MAX: number;
        if(Boolean(this.props.SlideCounter))
        {
        SHAREPOINT_MAX = +this.props.SlideCounter;
        }
        else {
        SHAREPOINT_MAX = 16;
        }

        myweb.lists.getById(SHAREPOINT_LIST).items
          .select("Id", "Title", "Keywords", "EncodedAbsUrl","LikesCount")
          .top(SHAREPOINT_MAX).get().then((items: any[]) => {
            resolve(items);
            if (items.length == 0) {
              resolve(-1);
            }
            else if (items.length > 0)
            {
              resolve(items);
              this.setState({ items: items, errormsg:"none",errorstatus:0});
            }
        }, (error: any): void => {
          this.setState({ errormsg:"block" });
          if(error.status == 404 || error.status == 400)
          {
            this.setState({errorstatus:error.status});
          }
          reject(error);
        });
      }
    }
    });
  }
  public async _getUserId(): Promise<string> {
    // tslint:disable-next-line:typedef
    let myweb = new Web(this.props.context.pageContext.web.absoluteUrl);
    return await myweb.currentUser.get().then((r: UserProfile) => {
      // tslint:disable-next-line:no-string-literal
      return r["Id"];
    });

  }

  public async _getUserLoginName(): Promise<string> {
    // tslint:disable-next-line:typedef
    let myweb = new Web(this.props.context.pageContext.web.absoluteUrl);
    return await myweb.currentUser.get().then((r: UserProfile) => {
      // tslint:disable-next-line:no-string-literal
      return r["LoginName"];
    });

  }

  // tslint:disable-next-line:typedef
  private  _getLikedBy(event, pid: string, imageTitle: string) {
    // tslint:disable-next-line:typedef
    let myweb = new Web(this.props.context.pageContext.web.absoluteUrl);
    // tslint:disable-next-line:typedef
    let userEmail = "";
    // tslint:disable-next-line:typedef
    let profileimage = "";
    // tslint:disable-next-line:radix
     myweb.lists.getById(this.props.listName2.id).items.getById(parseInt(pid))
        .select("LikedBy/Id, LikedBy/Title")
        .expand("LikedBy")
        .get()
        .then((items: any) => {
          let users: IUser[] = [];
          if (items.LikedBy.length > 0) {
            // tslint:disable-next-line:typedef
            for (let index = 0; index < items.LikedBy.length; index++) {

              myweb.siteUsers.getById(items.LikedBy[index].Id)
                .select("Email")
                .get()
                .then((result) => {
                  userEmail = result.Email;
                  profileimage = this.props.siteurl + "/_layouts/15/userphoto.aspx?size=L&username=" + userEmail;
                  users.push({
                    Id: items.LikedBy[index].Id,
                    Name: items.LikedBy[index].Title,
                    Email:userEmail,
                    UserImage:profileimage,
                  });
                  this.setState({imagelikedTitle:imageTitle, LikedUsers: users, hideDialogLikedby: false });
                });
            }
          } else {
            return;
         }
        });
    }

    private getLatestItemId(idpic:number): Promise<number> {
      let myweb = new Web(this.props.context.pageContext.web.absoluteUrl);
      return new Promise<number>((resolve: (itemId: number) => void, reject: (error: any) => void): void => {
        myweb.lists.getById(this.props.listName2.id)
          .items.getById(idpic)
          .select("Id","Keywords","LikedBy/Id, LikedBy/Title")
          .expand("LikedBy").get()
          .then((item: { Id: number,Keywords:Array<string>,LikedByStringId:Array<string>,LikesCount:number}): void => {
            if (item.Id == 0) {
              resolve(-1);
            }
            else {
              resolve(item.Id);
            }
          }, (error: any): void => {
            reject(error);
          });
      });
    }

  // tslint:disable-next-line:typedef
  private async _getPicLikes(event, pid: string) {
    let myweb = new Web(this.props.context.pageContext.web.absoluteUrl);
    let currUserEmail = "";
      this._getUserLoginName().then(res => { currUserEmail = res.toString(); });
    const membersGroup = await myweb.associatedMemberGroup.get();
    console.log(membersGroup);
    const memberGroupID = membersGroup.Id;
    console.log(memberGroupID);
    const visitorGroup = await myweb.associatedVisitorGroup.get();
    console.log(visitorGroup);
    const groupID = visitorGroup.Id;
    console.log(groupID);
    let currUserID = "";
    this._getUserId().then(res => { currUserID = res.toString(); });
    var userinvisitorsgroup = "";
    const usersd = await myweb.siteGroups.getById(groupID).users.get();
    console.log(usersd);
    // tslint:disable-next-line:typedef
    for (let index = 0; index < usersd.length; index++) {
      if((usersd[index].Id).toString() === currUserID) {
        userinvisitorsgroup = "bingo";
      }
    }
    console.log(userinvisitorsgroup);
    if(userinvisitorsgroup === "bingo")
    {
      console.log("Adding user " + currUserEmail);
      // tslint:disable-next-line:no-function-expression
      pnp.sp.web.siteGroups.getById(memberGroupID).users.add(currUserEmail).then(function(d){
        console.log(d);
    });
      console.log("User Added");
    }

    this.setState({  LikedUsers:[]});

    let userLikeCount:number = 0;
    let likesUserIds: Array<string> = [];

    // tslint:disable-next-line:typedef
    let etag: string = undefined;
      // tslint:disable-next-line:typedef


      this.getLatestItemId(+pid)
      .then((itemId: number): Promise<Item> => {
        if (itemId === -1) {
          throw new Error('No items found in the list');
        }
        return myweb.lists.getById(this.props.listName2.id)
        .items.getById(itemId).get(undefined, {
          headers: {
            'Accept': 'application/json;odata=minimalmetadata'
          }
        });
    })
    .then((item: Item): Promise<ILike> => {
      etag = item["odata.etag"];
      return Promise.resolve((item as any) as ILike);
    })
    .then((item: ILike): Promise<ItemUpdateResult> => {
      // If image was not liked
      if(item.LikedByStringId === null)
      {
        likesUserIds.push(currUserID);
        userLikeCount = 1;
      }
      if(item.LikedByStringId !== null)
      {

        if(item.LikedByStringId.indexOf(currUserID).toString() === "-1") {
          for (let index = 0; index < item.LikedByStringId.length; index++) {
            likesUserIds.push(item.LikedByStringId[index]);
          }
              likesUserIds.push(currUserID);
              // tslint:disable-next-line:no-unused-expression
              userLikeCount = 0;
              userLikeCount = +item.LikedByStringId.length + 1;
        }
        if(item.LikedByStringId.indexOf(currUserID).toString() !== "-1") {
          likesUserIds = [];
          for (let index = 0; index < item.LikedByStringId.length; index++) {
            likesUserIds.push(item.LikedByStringId[index]);
          }

          userLikeCount = +item.LikedByStringId.length;
        }

      }

      return myweb.lists.getById(this.props.listName2.id)
      .items.getById(item.Id).update({
        LikesCount: userLikeCount,
        LikedByStringId: {"results": likesUserIds}
      }, etag);

    })
    .then((result: ItemUpdateResult): void => {

        this._getSlides().then((resul: Array<IListService>) => {
        this.setState({ items: resul, active:null });
      });
        this._getKeywords().then((resul: Array<IListKeywords>) => {
        this.setState({ Kitems: resul, active: null });
      });

    }, (error: any): void => {
      console.log(error);
    });

    if(userinvisitorsgroup === "bingo")
    {
      // tslint:disable-next-line:no-function-expression
      pnp.sp.web.siteGroups.getById(memberGroupID).users.removeByLoginName(currUserEmail).then(function(d){
      console.log(d);
    });
    }
  }




 private _getKeywords(options?: any): Promise<IListKeywords[]> {
    return new Promise<IListKeywords[]>((resolve: any) => {
      // tslint:disable-next-line:typedef
      let myweb = new Web(this.props.context.pageContext.web.absoluteUrl);
      var SHAREPOINT_LIST: string = this.props.listName2.id;

       let SHAREPOINT_MAX: number;
        if(Boolean(this.props.SlideCounter))
        {
        SHAREPOINT_MAX = +this.props.SlideCounter;
        }
        else {
        SHAREPOINT_MAX = 16;
        }
       myweb.lists.getById(SHAREPOINT_LIST).items
        .select("Keywords")
        .top(SHAREPOINT_MAX)
        .get()
        .then((items: any[]) => {
          // tslint:disable-next-line:typedef
          var KeyArray;
          // tslint:disable-next-line:typedef
          for (let index = 0; index < items.length; index++) {
            if (Boolean(items[index].Keywords) === true) {
              KeyArray += items[index].Keywords + ",";
            }
          }
          if(KeyArray.charAt(KeyArray.length -1) === ",") {
          KeyArray = KeyArray.slice(0, KeyArray.length -1);
          KeyArray = KeyArray.substr(9, KeyArray.length);
          }

          // tslint:disable-next-line:no-function-expression
          // tslint:disable-next-line:typedef
          // tslint:disable-next-line:no-function-expression
          var array = KeyArray.split(",").map(function(n) {
            return String(n);
            });

           // tslint:disable-next-line:typedef
           var obj = {};
          // tslint:disable-next-line:typedef
          for (var i = 0, len = array.length; i < len; i++) {
            array[i] = array[i].trim();
            obj[array[i]] = array[i];
          }
            array = new Array();
          // tslint:disable-next-line:forin
          for (var key in obj) {
          array.push(obj[key]);
          }
          let itemsKeywords: IListKeywords[] = [];
          // tslint:disable-next-line:typedef
          for (let index = 0; index < array.length; index++) {
            itemsKeywords.push({Keywords : array[index]});
          }
          this.setState({ Kitems: itemsKeywords });
          resolve(itemsKeywords);
        });
    });
  }
}
export default PictureInfo;
