<template lang="pug">
  v-card
    v-card-title
      span.headline.px-3 {{ formTitle }}
    v-card-text
      v-tabs( v-model='model', centered)
        v-tab(href='#form')
          |Datos Personales
        v-tab(href='#formA')
          |Datos Conyuge
        v-tab(href='#formB')
          |Datos Aval
        v-tabs-items(v-model='model')
          v-tab-item(id='form')
            v-card.px-3(flat,height="300px")
              v-card-text
                v-form
                  v-layout
                    v-flex(xs12)
                      v-text-field(label='Nombres y Apellidos', v-model='item.nombres',:error-messages='nombresErrors', @input='$v.item.nombres.$touch()', @blur='$v.item.nombres.$touch()')
                      v-text-field(label='Estado Civil', v-model='item.estadoCivil',:error-messages='estadoCivilErrors', @input='$v.item.estadoCivil.$touch()', @blur='$v.item.estadoCivil.$touch()')
                      v-text-field(label='DNI/CE', v-model='item.dni',:error-messages='dniErrors', @input='$v.item.dni.$touch()', @blur='$v.item.dni.$touch()')
                      v-text-field(label='Nacionalidad', v-model='item.nacionalidad',:error-messages='nacionalidadErrors', @input='$v.item.nacionalidad.$touch()', @blur='$v.item.nacionalidad.$touch()')
                      v-text-field(label='Profesion u Ocupacion', v-model='item.profesion',:error-messages='profesionErrors', @input='$v.item.profesion.$touch()', @blur='$v.item.profesion.$touch()')
                      v-text-field(label='E-mail', v-model='item.email',:error-messages='emailErrors', @input='$v.item.email.$touch()', @blur='$v.item.email.$touch()')
                      v-text-field(label='Direccion', v-model='item.direccion',:error-messages='direccionErrors', @input='$v.item.direccion.$touch()', @blur='$v.item.direccion.$touch()')
                      v-text-field(label='Telefono o celular', v-model='item.telefono',:error-messages='telefonoErrors', @input='$v.item.telefono.$touch()', @blur='$v.item.telefono.$touch()')
          v-tab-item(id='formA')
            v-card.px-3(flat,height="300px")
              v-card-text
                v-form
                  v-layout
                    v-flex(xs12)
                      v-text-field(label='Nombres y Apellidos', v-model='item.nombresConyuge',:error-messages='nombreConyugeErrors', @input='$v.item.nombreConyuge.$touch()', @blur='$v.item.nombreConyuge.$touch()')
                      v-text-field(label='DNI/CE', v-model='item.dniConyuge',:error-messages='dniConyugeErrors', @input='$v.item.dniConyuge.$touch()', @blur='$v.item.dniConyuge.$touch()')
                      v-text-field(label='Nacionalidad', v-model='item.nacionalidadConyuge',:error-messages='nacionalidadConyugeErrors', @input='$v.item.nacionalidadConyuge.$touch()', @blur='$v.item.nacionalidadConyuge.$touch()')
                      v-text-field(label='Telefono o celular', v-model='item.telefonoConyuge',:error-messages='telefonoConyugeErrors', @input='$v.item.telefonoConyuge.$touch()', @blur='$v.item.telefonoConyuge.$touch()')
                      v-text-field(label='Profesion u Ocupacion', v-model='item.profesionConyuge',:error-messages='profesionConyugeErrors', @input='$v.item.profesionConyuge.$touch()', @blur='$v.item.profesionConyuge.$touch()')
                      v-text-field(label='E-mail', v-model='item.emailConyuge',:error-messages='emailConyugeErrors', @input='$v.item.emailConyuge.$touch()', @blur='$v.item.emailConyuge.$touch()')
    v-spacer
    v-card-actions.px-5
      v-btn(@click='submit') {{buttonTitle}}
      v-btn(v-if="index === -1", @click='clear') limpiar
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { modelRef } from "@/config/firebaseConfig";
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength, email } from "vuelidate/lib/validators";
export default {
  props: {
    index: {
      type: Number,
      default: -1
    },
    item: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  mixins: [validationMixin],
  validations: {
    item: {
      nombres: { required },
      estadoCivil: { required },
      dni: { required, maxLength: maxLength(8), minLength: minLength(8) },
      nacionalidad: { required },
      profesion: { required },
      email: { required, email },
      direccion: { required },
      telefono: { required, minLength: minLength(7) },
      //datos conyuge
      nombresConyuge: { required },
      dniConyuge: { required, maxLength: maxLength(8) },
      nacionalidadConyuge: { required },
      profesionConyuge: { required },
      emailConyuge: { required, email },
      telefonoConyuge: { required, minLength: minLength(7) },
    }
  },
  data: () => ({
    alert: false,
    items: [],
    model: null
  }),
  watch: {},
  methods: {
    submit() {
      this.$v.item.$touch();
      if (this.$v.item.$error) {
        console.log("Invalido");
        return;
      }
      this.index > -1
        ? this.editModel({ index: this.index, item: this.item })
        : this.saveModel(this.item);
      this.close();
    },
    clear() {
      this.$v.item.$reset();
      this.item.name = null;
      this.item.description = null;
    },
    close() {
      console.log("close method");
      this.keepAlive(false);
    },
    ...mapActions({
      saveModel: "models/saveModel",
      editModel: "models/editModel",
      keepAlive: "models/keepAlive"
    })
  },
  computed: {
    formTitle() {
      return this.index === -1 ? "Nuevo Cliente" : "Editar Cliente";
    },
    buttonTitle() {
      return this.index === -1 ? "Guardar" : "Editar";
    },
    nombresErrors() {
      const errors = [];
      if (!this.$v.item.nombres.$dirty) return errors;
      !this.$v.item.nombres.required && errors.push("Nombre es requerido.");
      return errors;
    },
    estadoCivilErrors() {
      const errors = [];
      if (!this.$v.item.estadoCivil.$dirty) return errors;
      !this.$v.item.estadoCivil.required &&
        errors.push("Descripcion de requerido");
      return errors;
    },
    nacionalidadErrors() {
      const errors = [];
      if (!this.$v.item.nacionalidad.$dirty) return errors;
      !this.$v.item.nacionalidad.required &&
        errors.push("Nacionalidad es requerido");
      return errors;
    },
    profesionErrors() {
      const errors = [];
      if (!this.$v.item.profesion.$dirty) return errors;
      !this.$v.item.profesion.required &&
        errors.push("Profesion es requerido");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.item.email.$dirty) return errors;
      !this.$v.item.email.required &&
        errors.push("Email es requerido");
      !this.$v.item.email.email &&
        errors.push("Email no es valido");
      return errors;
    },
    direccionErrors() {
      const errors = [];
      if (!this.$v.item.direccion.$dirty) return errors;
      !this.$v.item.direccion.required &&
        errors.push("Direccion es requerido");
      return errors;
    },
    telefonoErrors() {
      const errors = [];
      if (!this.$v.item.telefono.$dirty) return errors;
      !this.$v.item.telefono.required &&
        errors.push("Telefono es requerido");
      !this.$v.item.telefono.minLength &&
        errors.push("Telefono debe tener 7 caracteres como minimo");
      return errors;
    },
    //datos de conyuge
    nombresConyugeErrors() {
      const errors = [];
      if (!this.$v.item.nombresConyuge.$dirty) return errors;
      !this.$v.item.nombresConyuge.required && errors.push("Nombre de conyuge es requerido.");
      return errors;
    },
    dniConyugeErrors() {
      const errors = [];
      if (!this.$v.item.dniConyuge.$dirty) return errors;
      !this.$v.item.dniConyuge.required &&
        errors.push("DNI es requerido");
      !this.$v.item.dniConyuge.minLength &&
        errors.push("DNI debe tener 8 caracteres minimo");
      !this.$v.item.dniConyuge.maxLength &&
        errors.push("DNI debe tener 8 caracteres maximo");
      return errors;
    },
    nacionalidadConyugeErrors() {
      const errors = [];
      if (!this.$v.item.nacionalidadConyuge.$dirty) return errors;
      !this.$v.item.nacionalidadConyuge.required &&
        errors.push("Nacionalidad de conyuge es requerido");
      return errors;
    },
    telefonoConyugeErrors() {
      const errors = [];
      if (!this.$v.item.telefonoConyuge.$dirty) return errors;
      !this.$v.item.telefonoConyuge.required &&
        errors.push("Telefono de conyuge es requerido");
      !this.$v.item.telefonoConyuge.minLength &&
        errors.push("Telefono de conyuge debe tener 7 caracteres como minimo");
      return errors;
    },
    profesionConyugeErrors() {
      const errors = [];
      if (!this.$v.item.profesionConyuge.$dirty) return errors;
      !this.$v.item.profesionConyuge.required &&
        errors.push("Profesion de conyuge es requerido");
      return errors;
    },
    emailConyugeErrors() {
      const errors = [];
      if (!this.$v.item.emailConyuge.$dirty) return errors;
      !this.$v.item.emailConyuge.required &&
        errors.push("Email de conyuge es requerido");
      !this.$v.item.emailConyuge.email &&
        errors.push("Email de conyuge no es valido");
      return errors;
    },
  }
};
</script>