<script>
export default {
  name: "BulkCreateUsers",
  data(){
    return {
      users: []
    }
  },
  methods: {
    add(){
      this.users.push({
        "username": "",
        "firstName": "",
        "lastName": "",
        "email": "",
        "password": "",
        "phone": "",
        "userStatus": 1
      })
    },
    remove(index){
      this.users.splice(index, 1);
    },
    save(){
      this.axiosPost('/user/createWithList', this.users, r => {
        this.notify('Users created!')
      })
    }
  }
}
</script>

<template>
  <q-page>
    <div class="page-content">
      <div class="page-content-header with-button">
        Create Users
      </div>
      <form class="page-content-white" @submit.prevent="save">
        <q-markup-table separator="cell" class="q-mb-md">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Phone</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          <tr v-for="(user, index) in users" :key="index">
            <td>{{ index + 1 }}</td>
            <td>
              <q-input :rules="requiredRules" v-model="user.username" dense filled hide-bottom-space  />
            </td>
            <td>
              <q-input :rules="requiredRules" v-model="user.firstName" dense filled hide-bottom-space  />
            </td>
            <td>
              <q-input :rules="requiredRules" v-model="user.lastName" dense filled hide-bottom-space  />
            </td>
            <td>
              <q-input :rules="requiredRules" type="email" v-model="user.email" dense filled hide-bottom-space  />
            </td>
            <td>
              <q-input :rules="requiredRules" type="text" v-model="user.password" dense filled hide-bottom-space  />
            </td>
            <td>
              <q-input :rules="requiredRules" type="tel" v-model="user.phone" dense filled hide-bottom-space  />
            </td>
            <td>
              <q-select v-model="user.userStatus"
                        dense
                        filled
                        label="Status"
                        map-options
                        emit-value
                        :options="[
                            {value: 1, label: 'Enabled'},
                            {value: 0, label: 'Not Enabled'},
                        ]"></q-select>
            </td>
            <td>
              <q-btn icon="fas fa-trash-alt"
                     dense
                     flat
                     color="negative"
                     @click="remove(index)"/>
            </td>
          </tr>
          <tr>
            <td colspan="8">
              <q-btn dense flat no-caps label="Add" icon="fas fa-plus" @click="add"/>
            </td>
          </tr>
          </tbody>
        </q-markup-table>

        <q-btn color="positive" no-caps label="Create" type="submit"></q-btn>
        <q-btn to="/login" flat no-caps label="Back To Login" icon="fas fa-arrow-left"></q-btn>
      </form>
    </div>
  </q-page>
</template>

<style scoped>

</style>
