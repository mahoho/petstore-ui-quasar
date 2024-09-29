<template>
  <q-page>
    <div class="page-content list-page">
      <div class="page-content-header with-button">

        <button @click="openEditUser({})"
                class="button button-primary">
          Add User
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

          <template v-slot:body-cell-email="props">
            <q-td key="email"
                  :props="props">
              <a :href="'mailto:'+props.row.email">
                {{ props.row.email }}
              </a>
            </q-td>
          </template>
          <template v-slot:body-cell-userStatus="props">
            <q-td key="userStatus"
                  :props="props">
              {{ props.row.userStatus ? "Enabled" : "Not Enabled" }}
            </q-td>
          </template>
          <template v-slot:body-cell-edit="props">
            <q-td key="edit"
                  :props="props">
              <q-btn flat
                     @click="openEditUser(props.row)"
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
import EditUser from 'pages/EditUser';

export default {
  name: 'UsersPage',
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
      }
    };
  },
  mounted() {
    let cols = {
      id: 'ID #',
      email: 'Email',
      userStatus: 'Status',
      username: 'Username',
      firstName: 'First Name',
      lastName: 'Last Name',
      phone: 'Phone',
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
      'email',
      'userStatus',
      'username',
      'firstName',
      'lastName',
      'phone',
      'edit',
      'remove',
    ]

    this.getList();
  },
  methods: {
    openEditUser(user) {
      this.$q.dialog({
        component: EditUser,

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
        user: user,
        user_id: user.id,
        dismiss: () => {
          this.getList()
        }
      })
    },
    getList() {
      this.axiosGet('/user', (r) => {
        this.items = r.data;
      });
    },
    deleteItem(item) {
      this.$q.dialog({
        title: 'Confirm',
        message: `Are sure want to delete ${item.username} user?`,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.axiosDelete('/user/delete/' + item.username, (r) => {
          this.getList();

          this.$q.notify({
            message: `User ${item.username} deleted!`,
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
