<template lang="pug">
  v-card
    //- v-toolbar(dark, dense, tabs)
      v-toolbar-title Equipo
      v-spacer
      v-btn(icon,@click="close") 
        v-icon close
    v-tabs( v-model='model', centered)
      v-tab(href='#form',@click="back")
        v-icon laptop
      v-tab(href='#result',:disabled="resultTabDisabled")
        v-icon fas fa-barcode
      //- v-tabs-items(v-model='model')
      v-tab-item(id='form')
        v-card.px-3(flat,height="300px")
          v-card-title
            span.subheading {{ formTitle }}
          v-card-text
            v-form
              v-layout
                v-flex(xs12)
                  v-text-field(label='N° Serie', v-model='item.nroSerie', :error-messages='nroSerieErrors', @input='$v.item.nroSerie.$touch()', @blur='$v.item.nroSerie.$touch()')
                  v-select(label='Modelo', v-model='item.model', :items='models2Names', :error-messages='modelErrors', @change='$v.item.model.$touch()', @blur='$v.item.model.$touch()')
                  v-spacer
                  v-btn(@click='submit') {{buttonTitle}}
                  v-btn(v-if="index === -1", @click='clear') limpiar
      v-tab-item(id='result')
        v-layout(row,justify-center)
          v-flex(xs12)
            v-card(flat,height="300px")
              v-card-text
                v-layout(row,wrap)
                  v-flex(xs12)
                    vue-bar-code#result-code(v-if="result",:value="`${result}`",:options="barOptions")
                  v-flex.text-xs-center(xs12)
                      v-btn(@click="saveBarCode",icon)
                        v-icon file_download
                      v-btn(@click="generateBarCode",icon)
                        v-icon refresh
                      v-btn(@click="back",icon)
                        v-icon arrow_back
</template>

<script>
import moment from "moment";
import { settingsRef } from "@/config/firebaseConfig";
import { mapGetters, mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
export default {
  components: {},
  props: {
    index: {
      type: Number,
      default: -1,
      required: false
    },
    item: {
      type: Object,
      required: false,
      default: function() {
        return {
          // nroSerie: "",
          // model: "null",
          // nroInventario: "",
          // createAt: ""
        };
      }
    }
  },
  mixins: [validationMixin],
  validations: {
    item: {
      nroSerie: { required },
      model: { required }
    }
  },
  data: () => ({
    alert: false,
    model: "form",
    barOptions: {
      displayValue: true,
      width: 1
    },
    resultTabDisabled: true,
    result: null,
    file: null
  }),
  created() {
    this.fetchModels();
  },
  watch: {},
  methods: {
    back() {
      this.model = "form";
      this.clear();
    },
    submit() {
      this.$v.item.$touch();
      if (this.$v.item.$error) {
        console.log("Invalido");
        return;
      }
      this.item.createAt = this.getdate;
      this.index > -1
        ? this.editStore({ index: this.index, item: this.item }).then(() => {
            console.log("Store editado");
          })
        : this.saveStore(this.item).then(snapShot => {
            console.log("Store guardado");
            console.log(snapShot.key);
            this.model = "result";
            this.result = snapShot.key;
            setTimeout(() => {
              this.generateBarCode();
            }, 3000);
          });
      // this.close();
    },
    clear() {
      this.$v.item.$reset();
      this.item.nroSerie = null;
      this.item.model = null;
      this.item.createAt = null;
    },
    close() {
      console.log("close method");
      this.keepAlive(false);
    },
    saveBarCode() {
      let pdfName = "barcode.pdf";
      this.file.save(pdfName);
    },
    generateBarCode() {
      console.log("Creating barcode");
      this.file = new jsPDF({
        orientation: "landscape",
        unit: "cm",
        format: [6, 3]
      });

      html2canvas(document.getElementById("result-code"), {
        scale: "2",
        imageTImeOut: "0"
        // width: "100",
        // height: "60"
      })
        .then(canvas => {
          console.log("Creando...");
          this.file.addImage(canvas, "JPEG", 0.1, 0.1, 5.8, 2.8);
          console.log("barcode creating");
          let pdfName = "barcode.pdf";
          this.file.save(pdfName);
        })
        .catch(error => console.log(error));
    },
    ...mapActions({
      fetchModels: "models/fetchModels",
      saveStore: "store/saveStore",
      editStore: "store/editStore",
      keepAlive: "store/keepAlive"
    })
  },
  computed: {
    getdate() {
      return moment().format("DD-MM-YYYY, hh:mm:ss a");
    },
    models2Names() {
      return this.models.map(model => model.name);
    },
    formTitle() {
      return this.index === -1 ? "Registro" : "Edicion";
    },
    buttonTitle() {
      return this.index === -1 ? "Guardar" : "Editar";
    },
    nroSerieErrors() {
      const errors = [];
      if (!this.$v.item.nroSerie.$dirty) return errors;
      !this.$v.item.nroSerie.required &&
        errors.push("Nro de Serie es requerido.");
      return errors;
    },
    modelErrors() {
      const errors = [];
      if (!this.$v.item.model.$dirty) return errors;
      !this.$v.item.model.required && errors.push("Modelo es requerido");
      return errors;
    },
    ...mapGetters({
      models: "models/getModels"
    })
  }
};
</script>
