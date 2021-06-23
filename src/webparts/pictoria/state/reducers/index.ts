
/* Reducersare JavaScript functions
 * Reducers accept an action and return a new state
 */

import { actionTypes, IActionID } from '../actions/index';
import { clone } from '@microsoft/sp-lodash-subset';

export interface IApplicationState{
    itemId:string;
    view: string;
    CTfound: string;


}


const initialState: IApplicationState = {
  itemId:"55",
  view:"ArticleNewsWp",
  CTfound:"found"
};



export default (state: IApplicationState = initialState, action:IActionID) => {
  var newState:IApplicationState = clone(state);
  switch (action.type) {
    case actionTypes.CTfound:
      newState.CTfound = action.data;
      return newState;
    case actionTypes.itemId:
      newState.itemId = action.data;
      return newState;
    case actionTypes.views:
      newState.view = action.data;
      return newState;

    default:
        return state;
  }
};



