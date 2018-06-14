export const SET_RESULT = "SET_RESULT";
export const SET_LINKS = "SET_LINKS";
export const SET_PAGE = "SET_PAGE";
export const SET_PAGINATION = "SET_PAGINATION";
export const SET_LOADING = "SET_LOADING";
export const SET_ALIVE = "SET_ALIVE";
export const SET_VISIBLE = "SET_VISIBLE";

export const SET_CUSTOMERS = "SET_CUSTOMERS";
export const ADD_CUSTOMER = "ADD_CUSTOMER";
export const UPDATE_CUSTOMER = "UPDATE_CUSTOMER";
export const DELETE_CUSTOMER = "DELETE_CUSTOMER";
export const CLEAR_CUSTOMER = "CLEAR_CUSTOMER";
export const SUCCESS_NOTIFICATION = "SUCCESS_NOTIFICATION";
export const REFRESH_NOTIFICATION = "REFRESH_NOTIFICATION";


import {
  customerRef
} from "@/config/firebaseConfig";
import {
  retrieveCustomers
} from "@/util/index";

const state = {
  headers: [{
      text: "Nombre y Apellidos",
      align: "left",
      sortable: true,
      value: "nombres"
    },
    {
      text: "Estado Civil",
      value: "estadoCivil"
    },
    {
      text: "DNI/CE",
      align: "left",
      value: "dni"
    },
    {
      text: "Nacionalidad",
      value: "nacionalidad",
      sortable: false
    },
    {
      text: "Ocupacion",
      value: "ocupacion",
      sortable: false
    },
    {
      text: "Email",
      value: "email",
      sortable: false
    },
    {
      text: "Direccion",
      value: "direccion",
      sortable: false
    },
    {
      text: "Telefono",
      value: "telefono",
      sortable: false
    },
    {
      text: "Nombre y Apellidos Conyuge",
      align: "left",
      sortable: true,
      value: "nombresConyuge"
    },
    {
      text: "DNI/CE Conyuge",
      align: "left",
      value: "dni"
    },
    {
      text: "Nacionalidad Conyuge",
      value: "nacionalidadConyuge",
      sortable: false
    },
    {
      text: "Ocupacion Conyuge",
      value: "ocupacionConyuge",
      sortable: false
    },
    {
      text: "Email Conyuge",
      value: "email",
      sortable: false
    },
    {
      text: "Telefono Conyuge",
      value: "telefonoConyuge",
      sortable: false
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
  models: [],
  model: {},
  // links: [],
  page: {
    number: 0,
    sort: "name",
    size: 5,
    totalElements: 0,
    totalPages: 0
  },
  loading: false,
  message: ""
};
const getters = {
  getHeaders: state => state.headers,
  getRowsPerPageItems: state => state.rowsPerPageItems,
  getPage: state => state.page,
  getModels: state => state.models,
  getLoading: state => state.loading,
  getTotalItems: (state, getters) => getters.getPage.totalElements,
  isAlive: state => state.alive,
  isVisible: state => state.visible,
  getMessage: state => state.message,
  getNoDataText: state => state.noDataText,
  getNoResultText: state => state.noResultext
};
const mutations = {
  [SET_RESULT]: (state, result) => (state.result = result),
  [SET_CUSTOMERS]: (state, models) => (state.models = models),
  [ADD_CUSTOMER]: (state, model) => state.models.unshift(model),
  [UPDATE_CUSTOMER]: (state, payload) => {
    let editedIndex = payload.index;
    Object.assign(state.models[editedIndex], payload.item);
  },
  [DELETE_CUSTOMER]: (state, model) => {
    let index = state.models.indexOf(model);
    state.models.splice(index, 1);
  },
  [CLEAR_CUSTOMER]: state => (state.model = {}),
  [SET_PAGE]: (state, page) => (state.page = page),
  [SET_PAGINATION]: (state, pagination) => {
    state.page.number = pagination.page - 1;
    state.page.size = pagination.rowsPerPage;
    state.page.sort = pagination.sortBy;
  },
  [SET_LOADING]: (state, loading) => (state.loading = loading),
  // [SET_VISIBLE]: (state, dialog) => (state.dialog = dialog),
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
  saveModel: (context, model) => {
    console.log("...Saving data");
    customerRef.push(model, () => {
        console.log("Succes saving");
        context.commit(SUCCESS_NOTIFICATION, "Modelo guardado");
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
  editModel: (context, payload) => {
    console.log("...Editing data");
    customerRef
      .child(payload.item.uid)
      .set(payload.item, () => {
        console.log("Succes editing");
        context.commit(SUCCESS_NOTIFICATION, "Modelo editado");
        context.commit(UPDATE_CUSTOMER, {
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
  deleteModel: (context, model) => {
    // newsRef
    //   .child(this.delete)
    //   .remove()
    //   .then(console.log("Registro eliminado"));

    console.log("...Deleting data");
    console.log(model.uid);

    customerRef.
    child(model.uid).
    remove(() => console.log('OnComplete -> Modelo eliminado '))
      .then(() => {
        console.log("Succes deleting");
        context.commit(DELETE_CUSTOMER, model);
        context.commit(SUCCESS_NOTIFICATION, "Modelo eliminado");
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
  fetchModels: context => {
    console.log("Fetching data");
    context.commit(SET_LOADING, true);
    customerRef.on('value', snapshot => {
        context.commit(
          SET_CUSTOMERS,
          retrieveCustomers(snapshot.key, snapshot.val())
        );
        // context.commit(SET_PAGE, context.getters.getResult.data.page);
        context.commit(SET_LOADING, false);
      },
      error => console.error(error.statusText)
    )
    // .finally(() => context.commit(SET_LOADING, false));
  },
  updatePage: (context, page) => context.commit(SET_PAGE, page),
  updatePagination: (context, pagination) =>
    context.commit(SET_PAGINATION, pagination),
  clearModel: context => commit(CLEAR_CUSTOMER),
  setDialog: (context, visible) => context.commit(SET_VISIBLE, visible)
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};