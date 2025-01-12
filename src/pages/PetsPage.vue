<template>
  <q-page>
    <div class="page-content list-page">
      <div class="page-content-header with-button">

        <button @click="openEditItem({})"
                class="button button-primary">
          Add Pet
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

          <template v-slot:top-left>
            <q-select v-model="filters.status"
                      dense
                      hide-bottom-space
                      filled
                      clearable
                      multiple
                      use-chips
                      options-dense
                      style="width: 300px"
                      :options="statuses"
                      @input="findByStatus"
                      label="Find by Status"
            />
            <q-select v-model="filters.tags"
                      dense
                      hide-bottom-space
                      filled
                      options-dense
                      style="width: 300px"
                      clearable
                      multiple
                      :options="tags"
                      use-chips
                      option-label="name"
                      @input="findByTags"
                      label="Find by Tags"
            />
          </template>

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

          <template v-slot:body-cell-category="props">
            <q-td key="category"
                  :props="props">
              {{props.row.category ? props.row.category.name : ''}}
            </q-td>
          </template>

          <template v-slot:body-cell-photoUrls="props">
            <q-td key="photoUrls"
                  :props="props">
              <q-img v-if="props.row.photoUrls" :src="$apiUrl + props.row.photoUrls[0]" style="width: 150px" contain />
            </q-td>
          </template>

          <template v-slot:body-cell-tags="props">
            <q-td key="tags"
                  :props="props">
              <div class="flex items-center wrap" style="gap: 5px">
                <q-badge v-for="(tag, index) in (props.row.tags || [])" :key="index">{{ tag.name }}</q-badge>
              </div>
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
import EditPet from "pages/EditPet.vue";

export default {
  name: 'PetsPage',
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
      tags: [],
      filters: {
        search: '',
        status: [],
        tags: []
      },
    };
  },
  mounted() {
    let cols = {
      id: 'ID #',
      name: 'Name',
      category: 'Category',
      photoUrls: 'Photo',
      tags: 'Tags',
      status: 'Status',
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
      'name',
      'category',
      'photoUrls',
      'tags',
      'status',
      'edit',
      'remove',
    ]

    this.getList();
    this.getTags();
  },
  methods: {
    findByStatus() {
      if(!this.filters.status || !this.filters.status.length) {
        this.getList()
        return
      }

      let status = this.filters.status.join(',')

      this.axiosGet(`/pet/findByStatus?status=${status}`, r => {
        this.items = r.data
      })
    },
    findByTags() {
      if(!this.filters.tags || !this.filters.tags.length) {
        this.getList()
        return
      }

      let tags = this.filters.tags.map(i => i.name).join(',')

      this.axiosGet(`/pet/findByTags?tags=${tags}`, r => {
        this.items = r.data
      })
    },
    getTags() {
      this.axiosGet('/tag', r => {
        this.tags = r.data;
      }, false)
    },
    openEditItem(item) {
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
        id: item.id,
      }).onDismiss(() => {
        this.getList()
      })
    },
    getList() {
      this.axiosGet('/pet', (r) => {
        this.items = r.data;
      });
    },
    deleteItem(item) {
      this.$q.dialog({
        title: 'Confirm',
        message: `Are sure want to delete ${item.name} pet?`,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.axiosDelete('/pet/' + item.id, (r) => {
          this.getList();

          this.$q.notify({
            message: `Pet ${item.name} deleted!`,
            type: 'positive',
          })
        })
      })
    }
  },
  computed: {
    statuses(){
      return this.$store.state.mainStore.petsStatuses
    }
  }
};
</script>

<style scoped>

</style>
