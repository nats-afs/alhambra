<template lang="pug">
    v-layout(row,wrap)
      v-flex(xs12)
        v-card
          v-card-title
            | Clientes
            v-spacer
            v-text-field(append-icon='search', label='Buscar', single-line, hide-details, v-model='search')
          v-dialog(v-if='dialog', v-model='dialog',width="400")
            customer-form(:index='editedIndex', :item='editedItem')
          v-data-table.elevation-1(:headers='headers', :items='items', :search='search', :loading='loading',:noDataText="noDataText",:noResultText="noResultText",:rowsPerPageItems="rowsPerPageItems")
            template(slot='items', slot-scope='props')
              td {{props.item.nombre}}
              td.text-xs-right {{ props.item.dni }}
              td.text-xs-right {{ props.item.estadoCivil }}
              td.text-xs-right {{ props.item.ocupacion }}
              td.text-xs-right {{ props.item.domicilio }}
              td.text-xs-right {{ props.item.distrito }}
              td.text-xs-right {{ props.item.celular }}
              td.text-xs-right {{ props.item.email }}
              td.justify-center.layout.px-0
                v-btn.mx-0(icon, @click='editItem(props.item)')
                  v-icon(color='orange darken-1') edit
                v-btn.mx-0(icon, @click='deleteItem(props.item)')
                  v-icon(color='light-green accent-4') delete
            template(slot='pageText', slot-scope='{ pageStart, pageStop }')
              | From {{ pageStart }} to {{ pageStop }}
        v-btn(dark,color="grey darken-2",fab,fixed,bottom, right,@click.stop="showForm(true)")
          v-icon add
      confirm-dialog(ref="confirm")
</template>
<script>
import faker from "faker";
import { mapGetters, mapActions } from "vuex";
import customerForm from "./CustomerForm";
import confirmDialog from "@/components/ConfirmDialog";
export default {
  components: { customerForm, confirmDialog },
  data: () => ({
    search: "",

    editedItem: {},
    editedIndex: -1,
    dialog: false,
    // items: [],
    // customer: {
    //   nombre: null,
    //   dni: null,
    //   estadoCivil: null,
    //   ocupacion: null,
    //   domicilio: null,
    //   distrito: null,
    //   celular: null,
    //   email: null
    // }
  }),
  watch: {
    dialog(val) {
      val || this.close();
    },
    live(val) {
      val || this.close();
    }
  },
  created() {
    this.fetchModels();
  },
  methods: {
    showForm(value) {
      this.dialog = value;
      this.keepAlive(value);
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.showForm(true);
    },
    deleteItem(item) {
      const index = this.items.indexOf(item);
      this.$refs.confirm
        .open("Eliminar Cliente", "Esta seguro?")
        .then(confirm => {
          if (confirm) {
            this.deleteModel(item);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    close() {
      console.log("Closing");
      this.showForm(false);
      setTimeout(() => {
        this.editedItem = Object.assign({}, {});
        this.editedIndex = -1;
      }, 300);
    },
    // fetchModels() {
    //   for (let index = 0; index < 50; index++) {
    //     this.customer = {}
    //     this.customer.nombre = faker.name.findName()
    //     this.customer.dni = '12345678'
    //     this.customer.estadoCivil = 'Soltero'
    //     this.customer.domicilio = faker.address.streetName()
    //     this.customer.email = faker.internet.email();
    //     this.customer.ocupacion = 'Profesor'
    //     this.customer.distrito = faker.address.state()
    //     this.customer.celular = faker.phone.phoneNumberFormat()
    //     this.items.push(this.customer)
    //   }
    // },
    ...mapActions({
      fetchModels: "customers/fetchModels",
      deleteModel: "customers/deleteModel",
      updatePagination: "customers/updatePagination",
      setDialog: "customers/setDialog",
      keepAlive: "customers/keepAlive"
    })
  },
  computed: {
    ...mapGetters({
      headers: "customers/getHeaders",
      rowsPerPageItems: "customers/getRowsPerPageItems",
      items: "customers/getModels",
      loading: "customers/getLoading",
      totalItems: "customers/getTotalItems",
      noDataText: "customers/getNoDataText",
      noResultText: "customers/getNoResultText",
      live: "customers/isAlive"
    })
  }
};
</script>