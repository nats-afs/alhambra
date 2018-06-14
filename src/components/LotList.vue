<template lang="pug">
  v-layout(row,wrap)
    v-flex(xs12)
      v-card
        v-card-title
          | Lotes
          v-spacer
          v-text-field(append-icon='search', label='Buscar', single-line, hide-details, v-model='search')
        v-dialog(v-if='dialog', v-model='dialog', max-width='1000px')
          lot-form(:index='editedIndex', :item='editedItem')
        v-data-table.elevation-1(:headers='headers', :items='items', :search='search', :loading='loading',:noDataText="noDataText",:noResultText="noResultText",:rowsPerPageItems="rowsPerPageItems")
          template(slot='items', slot-scope='props')
            td {{props.item.name}}
            td.text-xs-right {{ props.item.description }}
            td.text-xs-right {{ props.item.contractor }}
            td.text-xs-right {{ props.item.dateInit }}
            td.text-xs-right {{ props.item.dateEnd }}
            td.text-xs-right {{ props.item.createAt }}
            td.text-xs-right {{ props.item.amount }}
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
import { mapGetters, mapActions } from "vuex";
import lotForm from "./LotForm";
import confirmDialog from "@/components/ConfirmDialog";
export default {
  components: { lotForm, confirmDialog },
  data: () => ({
    search: "",
    editedItem: {},
    editedIndex: -1,
    dialog: false
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
    this.fetchLots();
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
        .open("Eliminar solicitante", "Esta seguro?")
        .then(confirm => {
          if (confirm) {
            this.deleteProject(item);
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
    ...mapActions({
      fetchLots: "lots/fetchLots",
      deleteProject: "lots/deleteLot",
      updatePagination: "lots/updatePagination",
      setDialog: "lots/setDialog",
      keepAlive: "lots/keepAlive"
    })
  },
  computed: {
    ...mapGetters({
      headers: "lots/getHeaders",
      rowsPerPageItems: "lots/getRowsPerPageItems",
      items: "lots/getLots",
      loading: "lots/getLoading",
      noDataText: "lots/getNoDataText",
      noResultText: "lots/getNoResultText",
      live: "lots/isAlive"
    })
  }
};
</script>