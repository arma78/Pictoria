import * as React from "react";
import { sp } from "@pnp/sp";
import pnp, {UserProfile, Web } from "sp-pnp-js";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/site-users/web";
import "@pnp/sp/folders";
import "@pnp/sp/clientside-pages/web";
import "@pnp/sp/comments/clientside-page";
import { ICardsView } from "../components/ICardsViewState";
import { IPictoriaProps } from "./IPictoriaProps";
import styles from "./CardsView.module.scss";
import * as moment from 'moment';
import { RichText } from "@pnp/spfx-controls-react/lib/RichText";
import { Icon } from "office-ui-fabric-react/lib/Icon";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";


class CardsView extends React.Component<IPictoriaProps, ICardsView> {

  constructor(props: IPictoriaProps, state: ICardsView) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });

    this.state = ({ id: "", items: [], SiteUser: "",UsersUpdateChecker:"none"});
  }

  public componentDidMount(): void {
    this._myValidation();
    let store = this.props.store;
    let itemid = store.getState().itemId;
    this._getfiles(itemid);
   }

  public componentDidUpdate(prevProps, prevState) {
    if(this.state.UsersUpdateChecker !== prevState.UsersUpdateChecker)
    {
      this._myValidation();
    }
  }
  public render(): React.ReactElement<IPictoriaProps> {


    return (
      <div className={styles.CardsView}>



        {this.state.items.length && this.state.items.map((lt) => {
          this.getSPData(lt.ListItemAllFields.EditorId);
          let store = this.props.store;
          let CTfound = store.getState().CTfound;
          return (
            <div>
              <div><h3>Detail View for : <b>{lt.Title}</b></h3></div>


              <div key="1" className={styles.stapler}
                style={{ background: this.props.newsCardBgColor }}>
                <div className={styles.NewsLeft}>
                  <img className={styles.newsimage}
                    onClick={(event) => this._openDialog(event, lt.Name)}
                    src={this.props.listName2.url + "/" + lt.Name}
                    alt={lt.Name} />
                  <p>{CTfound === "Notfound" ? lt.ListItemAllFields.Image_Copyright : lt.ListItemAllFields.wic_System_Copyright}</p>
                </div>
                <div className={styles.NewsRight}>
                  <ul className={styles.nobullets}>
                    <li><b>Image Title:</b></li>
                    <li>{lt.Title}</li>
                    <li><b>Image Name:</b></li>
                    <li>{lt.Name}</li>
                    <li><b>Image Keywords:</b></li>
                    <li>{lt.ListItemAllFields.Keywords}</li>
                    <li><b>Likes Count:</b></li>
                    <li><Icon iconName="LikeSolid" />{lt.ListItemAllFields.LikesCount}</li>
                  </ul>
                </div>
              </div>
              <hr></hr>
              <div key="2" className={styles.stapler1}
                style={{ background: this.props.newsCardBgColor }}>
                <div className={styles.NewsLeft2}>
                  <ul className={styles.nobullets}>
                    <li><b>Image Author:</b></li>
                    <li>{CTfound === "Notfound" ? lt.ListItemAllFields.Image_Author : lt.ListItemAllFields.OData__Author}</li>
                    <li><b>Image Height:</b></li>
                    <li>{lt.ListItemAllFields.ImageHeight} px</li>
                    <li><b>Image Width:</b></li>
                    <li>{lt.ListItemAllFields.ImageWidth} px</li>
                  </ul>
                </div>
                <div className={styles.NewsRight2}>
                  <RichText isEditMode={false}
                    value={lt.ListItemAllFields.Card_x0020_Content}
                  />
                </div>
              </div>
              <hr></hr>
              <div key="3" className={styles.stapler2}
                style={{ background: this.props.newsCardBgColor }}>
                <div className={styles.NewsLeft3} style={{display:this.state.UsersUpdateChecker}}>
                  <PrimaryButton
                    onClick={(event) => this._EditMeta(event, lt.ListItemAllFields.Id)}
                    text="Edit" />

                </div>
                <div className={styles.NewsRight3}>
                  <ul className={styles.nobullets}>
                    <li><b>Created By: </b>
                      {lt.Author.Title}</li>
                    <li><b>Date Created: </b>
                      {moment(lt.TimeCreated).format("YYYY-MM-DD HH:mm")}</li>
                    <li><b>Modified By: </b>
                      {this.state.SiteUser}</li>
                    <li><b>Date Modified: </b>
                      {moment(lt.TimeLastModified).format("YYYY-MM-DD HH:mm")}</li>
                  </ul>
                </div>
              </div>


              <div>
              </div>





            </div>





          );

        })}
      </div>
    );
  }

  private _EditMeta(e, id: string) {
    location.href = this.props.listName2.url + "/Forms/EditForm.aspx?ID=" + id;
  }

  private async getSPData(id: string) {
    let user = await sp.web.getUserById(parseInt(id)).get();
    this.setState({ SiteUser: user.Title });
  }

  public async _getUserId(): Promise<string> {
    // tslint:disable-next-line:typedef
    let myweb = new Web(this.props.context.pageContext.web.absoluteUrl);
    return await myweb.currentUser.get().then((r: UserProfile) => {
      // tslint:disable-next-line:no-string-literal
      return r["Id"];
    });

  }

   // tslint:disable-next-line:typedef
   private async _AuthorizedToUpdate(): Promise<string> {
    // tslint:disable-next-line:typedef
    let myweb = new Web(this.props.context.pageContext.web.absoluteUrl);
    let currUserID = "";
    this._getUserId().then(res => { currUserID = res.toString(); });
      // tslint:disable-next-line:typedef
      const memberGroup = await myweb.associatedVisitorGroup.get();
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
  public _myValidation() {
    this._AuthorizedToUpdate().then(res => {
         if(res === "bingo") {
          this.setState({UsersUpdateChecker:"none"});
        } else {
          this.setState({UsersUpdateChecker:"block"});
        }
      });
    }


  private _openDialog(e:any, imgName:string) {
    window.open(
       this.props.listName2.url + "/" + imgName,
      '_blank'
    );
  }

  public async _getfiles(filterId: string) {
    const allItems: any[] = await sp.web.getFolderByServerRelativeUrl(this.props.listName2.url)
      .files
      .expand("ListItemAllFields,Author, Files/ListItemAllFields")
      .filter("ListItemAllFields/ID eq " + filterId)
      .get();
     this.setState({ items: allItems });

  }



}
export default CardsView;
