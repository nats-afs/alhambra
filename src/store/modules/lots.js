export const SET_LOADING = "SET_LOADING";
export const SET_ALIVE = "SET_ALIVE";
export const SET_VISIBLE = "SET_VISIBLE";

export const SET_LOTS = "SET_LOTS";
export const ADD_LOT = "ADD_LOT";
export const UPDATE_LOT = "UPDATE_LOT";
export const DELETE_LOT = "DELETE_LOT";
export const CLEAR_LOT = "CLEAR_LOT";
export const SUCCESS_NOTIFICATION = "SUCCESS_NOTIFICATION";
export const REFRESH_NOTIFICATION = "REFRESH_NOTIFICATION";


import {
  lotRef
} from "@/config/firebaseConfig";
import {
  retrieveLots
} from "@/util/index";

const state = {
  headers: [{
      text: "Direccion",
      align: "left",
      sortable: true,
      value: "address"
    },
    {
      text: "Distrito",
      align: "left",
      value: "city"
    },
    {
      text: "Area del terreno",
      align: "left",
      value: "area_mt2"
    },
    {
      text: "Acciones",
      value: "name",
      sortable: false
    }
  ],
  noDataText: "Informacion no disponible",
  noResultext: "No se encontraron registros con los criterios de busqueda",
  rowsPerPageItems: [
    10,
    25,
    50,
    100,
    {
      text: "Todo",
      value: -1
    }
  ],
  alive: false,
  visible: false,
  lots: [],
  lot: {},
  loading: false,
  message: ""
};
const getters = {
  getHeaders: state => state.headers,
  getRowsPerPageItems: state => state.rowsPerPageItems,
  getLots: state => state.lots,
  getLoading: state => state.loading,
  isAlive: state => state.alive,
  isVisible: state => state.visible,
  getMessage: state => state.message,
  getNoDataText: state => state.noDataText,
  getNoResultText: state => state.noResultext
};
const mutations = {
  [SET_LOTS]: (state, lots) => (state.lots = lots),
  [ADD_LOT]: (state, lot) => state.lots.unshift(lot),
  [UPDATE_LOT]: (state, payload) => {
    let editedIndex = payload.index;
    Object.assign(state.lots[editedIndex], payload.item);
  },
  [DELETE_LOT]: (state, lot) => {
    let index = state.lots.indexOf(lot);
    state.lots.splice(index, 1);
  },
  [CLEAR_LOT]: state => (state.lot = {}),
  [SET_LOADING]: (state, loading) => (state.loading = loading),
  [SET_ALIVE]: (state, alive) => (state.alive = alive),
  [SUCCESS_NOTIFICATION]: (state, message) => {
    state.visible = true;
    state.message = message;
  },
  [REFRESH_NOTIFICATION]: state => {
    state.visible = false;
    state.message = "";
  }
};
const actions = {
  keepAlive: (context, alive) => {
    console.log("State of live is " + alive);
    context.commit(SET_ALIVE, alive);
  },
  saveLot: (context, lot) => {
    console.log("...Saving data");
    lotRef.push(lot, () => {
        console.log("Succes saving");
        context.commit(SUCCESS_NOTIFICATION, "Lote guardado");
      })
      .then(() => context.commit(SET_ALIVE, false))
      .catch(error => console.log(error))
      .finally(() => {
        console.log("End of transaction");
        setTimeout(() => {
          context.commit(REFRESH_NOTIFICATION);
        }, 6000);
      })
  },
  editLot: (context, payload) => {
    console.log("...Editing data");
    lotRef
      .child(payload.item.uid)
      .set(payload.item, () => {
        console.log("Succes editing");
        context.commit(SUCCESS_NOTIFICATION, "Lote editado");
        context.commit(UPDATE_LOT, {
          index: payload.index,
          item: payload.item
        });
      })
      .then(() => context.commit(SET_ALIVE, false))
      .catch(error => console.log(error))
      .finally(() => {
        console.log("End of transaction");
        setTimeout(() => {
          context.commit(REFRESH_NOTIFICATION);
        }, 6000);
      });
  },
  deleteLot: (context, lot) => {
    console.log("...Deleting data");
    console.log(lot.uid);

    lotRef.
    child(lot.uid).
    remove(() => console.log('OnComplete -> Lote eliminado '))
      .then(() => {
        console.log("Succes deleting");
        context.commit(DELETE_LOT, lot);
        context.commit(SUCCESS_NOTIFICATION, "Lote eliminado");
        // setTimeout(() => {
        //   context.commit(SET_VISIBLE, false);
        // }, 300);
      })
      .catch(error => console.log(error))
      .finally(() => {
        console.log("End of transaction");
        setTimeout(() => {
          context.commit(REFRESH_NOTIFICATION);
        }, 6000);
      });
  },
  fetchLots: context => {
    console.log("Fetching data");
    context.commit(SET_LOADING, true);
    lotRef.on('value', snapshot => {
        context.commit(
          SET_LOTS,
          retrieveLots(snapshot.key, snapshot.val())
        );
        context.commit(SET_LOADING, false);
      },
      error => console.error(error.statusText)
    )
    // .finally(() => context.commit(SET_LOADING, false));
  },
  clearLot: context => commit(CLEAR_LOT),
  setDialog: (context, visible) => context.commit(SET_VISIBLE, visible)
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};