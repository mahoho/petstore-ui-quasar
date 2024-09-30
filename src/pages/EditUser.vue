<template>
  <q-dialog :value="true"
            ref="dialog"
            persistent>
    <q-card class="edit-page edit-user-page">
      <q-card-section>
        <div class="page-subtitle">
          {{ item.id ? 'Edit' : 'New' }} user #{{item.id}}
        </div>

        <form class="page-content"
                @submit.prevent="save()">
          <div class="page-content-white">
            <div class="form-group">
              <q-input v-model="item.username"
                       dense
                       hide-bottom-space
                       filled
                       label="Username"
                       :rules="[val => !!val || 'Field is required']"
                       required
              />
            </div>
            <div class="form-group">
              <q-input v-model="item.firstName"
                       dense
                       hide-bottom-space
                       filled
                       label="First Name"
                       :rules="[val => !!val || 'Field is required']"
                       required
              />
            </div>

            <div class="form-group">
              <q-input v-model="item.lastName"
                       dense
                       hide-bottom-space
                       filled
                       label="Last Name"
                       :rules="[val => !!val || 'Field is required']"
                       required
              />
            </div>


            <div class="form-group">
              <q-input v-model="item.password"
                       dense
                       filled
                       hide-bottom-space
                       type="password"
                       autocomplete="new-password"
                       label="Password"
                       :rules="!item.id ? [val => !!val || 'Field is required'] : []"
                       :required="!item.id"
              />
            </div>

            <div class="form-group">
              <q-input v-model="item.email"
                       dense
                       autocomplete="new-password"
                       filled
                       hide-bottom-space
                       type="email"
                       label="Email"
                       :rules="[val => !!val || 'Field is required']"
                       required
              />
            </div>

            <div class="form-group">
              <q-input v-model="item.phone"
                       dense
                       filled
                       type="tel"
                       label="Phone"
              />
            </div>

            <div class="form-group">
              <q-select v-model="item.userStatus"
                        dense
                        filled
                        label="Status"
                        map-options
                        emit-value
                        :options="[
                            {value: 1, label: 'Enabled'},
                            {value: 0, label: 'Not Enabled'},
                        ]"></q-select>
            </div>

          </div>
        </form>
      </q-card-section>
      <q-card-actions align="right">
        <button type="button" @click="hide()" class="button button-grey q-mr-md">
          Close
          <q-icon name="ion-ios-close-circle-outline"></q-icon>
        </button>
        <button class="button button-primary" @click="save">
          {{ item.id ? 'Update' : 'Create'}}
          <q-icon name="ion-ios-checkmark-circle"></q-icon>
        </button>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
  import {copy} from "boot/axios";

  export default {
    name: 'EditUser',
    props: ['user'],
    data() {
      return {
        item: {
          id: 0,
          firstName: '',
          lastName: '',
          username: '',
          email: '',
          phone: '',
          password: '',
          userStatus: 1,
        },
      };
    },
    mounted() {
      if(this.user && this.user.username) {
        this.item.username = this.user.username
      }

      if(this.item.username){
        this.get();
      }
    },
    methods: {
      save() {
        this.axiosPost('/user/' + this.item.username, this.item, (r) => {
          this.item = r.data

          this.$q.notify({
            message: 'User saved!',
            type: 'positive',
          });

          this.onOKClick()
        });
      },
      get() {
        this.axiosGet('/user/' + this.item.username, (r) => {
          this.item = r.data;
        });
      },

      // following method is REQUIRED
      // (don't change its name --> "show")
      show () {
        this.$refs.dialog.show()
      },

      // following method is REQUIRED
      // (don't change its name --> "hide")
      hide () {
        this.$refs.dialog.hide()
      },

      onDialogHide () {
        // required to be emitted
        // when QDialog emits "hide" event
        this.$emit('hide')
      },

      onOKClick () {
        // on OK, it is REQUIRED to
        // emit "ok" event (with optional payload)
        // before hiding the QDialog
        this.$emit('ok')
        // or with payload: this.$emit('ok', { ... })

        // then hiding dialog
        this.hide()
      },

      onCancelClick () {
        // we just need to hide dialog
        this.hide()
      }

    },
  };
</script>

<style scoped>

</style>
