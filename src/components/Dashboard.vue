<template lang="pug">
  v-app#inspire
    v-navigation-drawer(fixed, :mini-variant='miniVariant', :clipped='clipped', v-model='drawer', app, width="220")
      v-card
        v-card-media.mx-3.mt-2(contain,src="public/alhambra.png",height="80px")
        v-card-title johndoe@alhambra.com
          div
            span(class="grey--text") Administrador
      v-list(dense)
        template(v-for='item in items')
          v-layout(row, v-if='item.heading', align-center, :key='item.heading')
            v-flex(xs6)
              v-subheader(v-if='item.heading')
                | {{ item.heading }}
            v-flex.text-xs-center(xs6)
              a.body-2.black--text(href='#!') EDIT
          v-list-group(v-else-if='item.children', v-model='item.model', :key='item.text', :prepend-icon="item.model ? item.icon : item['icon-alt']", append-icon)
            v-list-tile(slot='activator')
              v-list-tile-content
                v-list-tile-title
                  | {{ item.text }}
            v-list-tile(v-for='(child, i) in item.children', :key='i', :to='{name: child.path}')
              v-list-tile-action(v-if='child.icon')
                v-icon {{ child.icon }}
              v-list-tile-content
                v-list-tile-title
                  | {{ child.text }}
          v-list-tile(v-else, :key='item.text', :to='{name: item.path}')
            v-list-tile-action
              v-icon {{ item.icon }}
            v-list-tile-content
              v-list-tile-title
                | {{ item.text }}
    v-toolbar(dark,color="blue darken-3", fixed, app, :clipped-left='clipped')
      v-toolbar-side-icon(@click.stop='drawer = !drawer')
      //- v-btn(icon, @click.stop='miniVariant = !miniVariant')
        v-icon(v-html="miniVariant ? 'chevron_right' : 'chevron_left'")
      v-btn(icon, @click.stop='clipped = !clipped')
        v-icon web
      //- v-btn(icon, @click.stop='fixed = !fixed')
        v-icon remove
      v-toolbar-title(v-text='title')
      v-spacer
      v-btn(icon, @click.stop='rightDrawer = !rightDrawer')
        v-icon menu
    v-content
      v-container(fluid,grid-list-xl)
        v-slide-y-transition(mode='out-in')
          router-view
    v-navigation-drawer(temporary, :right='right', v-model='rightDrawer', fixed)
      v-list
        v-list-tile(@click.native='right = !right')
          v-list-tile-action
            v-icon compare_arrows
          v-list-tile-title Switch drawer (click me)
    v-footer(:fixed='fixed', app)
      span © 2018

</template>

<script>
export default {
  data: () => ({
    clipped: false,
    drawer: null,
    fixed: false,
    items: [
      { icon: "dashboard", text: "Dashboard", path: "home" },
      { icon: "directions_run", text: "Clientes", path: "customer-list" },
      { icon: "domain", text: "Lotes", path: "lot-list" },
      { icon: "attach_money", text: "Cotizaciones", path: "customer-list" },
      { icon: "apps", text: "CheckList", path: "customer-list" },
      {
        icon: "keyboard_arrow_up",
        "icon-alt": "keyboard_arrow_down",
        text: "Control",
        model: true,
        children: [
          { icon: "add", text: "Nuevo Envio", path: "customer-list" },
          { icon: "list", text: "Retorno", path: "customer-list" }
        ]
      }
    ],
    miniVariant: false,
    right: true,
    rightDrawer: false,
    title: "Alhambra App"
  })

// registro de lotes con sus propiedades como medidas zona descripcion,etc
// registro de clientes
// cotizacion
// control de pagos
// notificaciones y avisos para los pagos.. y clientes retrasados
};
</script>


