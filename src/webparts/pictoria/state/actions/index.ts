
export enum actionTypes{
  views,
  itemId,
  CTfound
}

export interface IActionID{
  type: actionTypes;
  data: string;
}

export const getPictoriaFieldState = (CTfieldsfound:string):IActionID => {
  return {
    type: actionTypes.CTfound,
    data: CTfieldsfound
  };
};




export const viewSelector = (viewname:string):IActionID => {
  return {
    type: actionTypes.views,
    data: viewname
  };
};

export const getDetailView = (id:string):IActionID => {
  return {
    type: actionTypes.itemId,
    data: id
  };
};
