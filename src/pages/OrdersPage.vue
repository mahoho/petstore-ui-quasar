<template>
  <q-page>
    <div class="page-content list-page">
      <div class="page-content-header with-button">

        <button @click="openEditItem({})"
                class="button button-primary">
          Add Order
          <q-icon name="ion-ios-add-circle-outline"/>
        </button>
      </div>
      <div class="page-content-white">
        <q-table
            :dense="$q.screen.lt.md"
            :data="items"
            :columns="columns"
            :filter="filters.search"
            row-key="id"
            selection="none"
            :visible-columns="visibleColumns"
            :pagination.sync="pagination"
        >

          <template v-slot:top-right>
            <q-input dense
                     debounce="300"
                     v-model="filters.search"
                     class="q-mr-md"
                     placeholder="Search">
              <template v-slot:append>
                <q-icon name="ion-ios-search"/>
              </template>
            </q-input>

            <q-select
                v-model="visibleColumns"
                multiple
                outlined
                dense
                options-dense
                :display-value="$q.lang.table.columns"
                emit-value
                map-options
                :options="columns"
                option-value="name"
                options-cover
                style="min-width: 150px"
            />
          </template>

          <template v-slot:body-cell-pet="props">
            <q-td key="pet"
                  :props="props">
              <q-btn v-if="props.row.petId"
                     @click="openPet(props.row.petId)"
                     :label="pets[props.row.petId] ? pets[props.row.petId].name : 'Unknown'"
                     dense
                     no-caps
                     flat
              />
            </q-td>

          </template>

          <template v-slot:body-cell-complete="props">
            <q-td key="complete"
                  :props="props">
              {{props.row.complete ? "Complete" : "Not Complete"}}
            </q-td>
          </template>

          <template v-slot:body-cell-edit="props">
            <q-td key="edit"
                  :props="props">
              <q-btn flat
                     @click="openEditItem(props.row)"
                     icon="far fa-file-alt"/>
            </q-td>
          </template>
          <template v-slot:body-cell-remove="props">
            <q-td key="remove"
                  :props="props">
              <q-btn flat
                     color="negative"
                     icon="fas fa-trash-alt"
                     @click="deleteItem(props.row)"/>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
import EditOrder from "pages/EditOrder.vue";
import EditPet from "pages/EditPet.vue";

export default {
  name: 'OrdersPage',
  data() {
    return {
      selectAll: false,
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 20
        // rowsNumber: xx if getting data from a server
      },
      columns: [],
      visibleColumns: [],
      items: [],
      filters: {
        search: ''
      },
      pets: []
    };
  },
  mounted() {
    let cols = {
      id: 'ID #',
      pet: 'Pet',
      quantity: 'Quantity',
      shipDate: 'Ship Date',
      status: 'Status',
      complete: 'Complete',
      edit: 'Edit',
      remove: 'Delete',
    };

    for (let col in cols) {
      let align = ['is_active', 'edit', 'remove',].indexOf(col) > -1 ? 'center' : 'left';
      let sortable = ['edit', 'remove',].indexOf(col) > -1 ? false : true;

      this.columns.push({
        name: col,
        label: cols[col],
        field: col,
        align: align,
        sortable: sortable,
      });
    }

    this.visibleColumns = [
      'id',
      'pet',
      'quantity',
      'shipDate',
      'status',
      'complete',
      'edit',
      'remove',
    ]

    this.getList();
    this.getPets();
  },
  methods: {
    getPets(){
      this.axiosGet('/pet', (r) => {
        let pets = {}

        for(let item of r.data){
          pets[item.id] = item
        }

        this.pets = pets;
      }, false);
    },
    openEditItem(item) {
      this.$q.dialog({
        component: EditOrder,

        // optional if you want to have access to
        // Router, Vuex store, and so on, in your
        // custom component:
        parent: this, // becomes child of this Vue node
                      // ("this" points to your Vue component)
                      // (prop was called "root" in < 1.1.0 and
                      // still works, but recommending to switch
                      // to the more appropriate "parent" name)

        // props forwarded to component
        // (everything except "component" and "parent" props above):
        id: item.id,
      }).onDismiss(() => {
        this.getList()
      })
    },
    openPet(petId){
      this.$q.dialog({
        component: EditPet,

        // optional if you want to have access to
        // Router, Vuex store, and so on, in your
        // custom component:
        parent: this, // becomes child of this Vue node
                      // ("this" points to your Vue component)
                      // (prop was called "root" in < 1.1.0 and
                      // still works, but recommending to switch
                      // to the more appropriate "parent" name)

        // props forwarded to component
        // (everything except "component" and "parent" props above):
        id: petId,
      }).onDismiss(() => {
        this.getPets()
      })
    },
    getList() {
      this.axiosGet('/store/order', (r) => {
        this.items = r.data;
      });
    },
    deleteItem(item) {
      this.$q.dialog({
        title: 'Confirm',
        message: `Are sure want to delete #${item.id} order?`,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.axiosDelete('/store/order/' + item.id, (r) => {
          this.getList();

          this.$q.notify({
            message: `Order #${item.id} deleted!`,
            type: 'positive',
          })
        })
      })
    }
  }
};
</script>

<style scoped>

</style>
