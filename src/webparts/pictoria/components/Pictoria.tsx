import * as React from 'react';
import { IPictoriaProps } from './IPictoriaProps';
import PictureInfo from './PictureInfo';
import ArticleNewsWp from './ArticleNewsWp';
import styles from "./Pictoria.module.scss";
import CardsView from './CardsView';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { viewSelector} from '../state/actions';
import { IPictoriaState } from "./IPictoriaState";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";
import { v4 as uuidv4 } from 'uuid';


export default class Pictoria extends React.Component < IPictoriaProps, IPictoriaState > {


  public constructor(props:IPictoriaProps) {
    super(props);
    this.state = {active:null, navid1:"",navid2:""};

  }

  public componentDidMount(): void {
    this.getRandomIDs();
  }

  private getRandomIDs() {
    var res = uuidv4();
    var res2 = uuidv4();
    this.setState({ navid1: "nav1" + res });
    this.setState({ navid2: "nav2" + res2 });
  }
  private selectedTab = () => {
    let store = this.props.store;
    let view = store.getState().view;
    switch(view){
        case 'ArticleNewsWp':
            return <ArticleNewsWp {...this.props}/>;
        case 'PictureInfo':
            return <PictureInfo {...this.props}/>;
        case 'CardsView':
            return <CardsView {...this.props}/>;
        default:
            return <div>Welcome To Pictoria.</div>;
    }
}

private _myColor(e) {
console.log(e.target.id);
this.setState({active:e.target.id});
if(e.target.key === "ArticleNewsWp")
{
  this.props.store.dispatch(viewSelector("ArticleNewsWp"));
}
else {
  this.props.store.dispatch(viewSelector("PictureInfo"));
}

  if (this.state.active === e.target.id) {
    document.getElementById(this.state.active).style.backgroundColor = '#7e159e';
  }
}

  public render(): React.ReactElement<IPictoriaProps> {
        let nav1: string;
        if(Boolean(this.props.navmenuitem1))
        {
        nav1 = this.props.navmenuitem1;
        }
        else {
        nav1 = "Cards";
        }

        let nav2: string;
        if(Boolean(this.props.navmenuitem2))
        {
        nav2 = this.props.navmenuitem2;
        }
        else {
        nav2 = "Image Slider";
        }

    return (
     <div>
      <div style={{ display: 'flex', float: 'right'}} >
       <PrimaryButton id={this.state.navid1}   onClick={() => { this.props.store.dispatch(viewSelector("ArticleNewsWp")); }}>{nav1}</PrimaryButton>
      <b>&nbsp;&nbsp;</b>
       <PrimaryButton id={this.state.navid1}   onClick={() => { this.props.store.dispatch(viewSelector("PictureInfo")); }}>{nav2}</PrimaryButton>
      </div>
      <br></br>
      {this.selectedTab()}
      </div>
    );
  }
}

