<template>
  <q-dialog :value="true"
            ref="dialog"
            persistent>
    <q-card class="edit-page edit-user-page">
      <q-card-section>
        <div class="page-subtitle">
          {{ item.id ? 'Edit' : 'New' }} Category #{{item.id}}
        </div>

        <form class="page-content"
                @submit.prevent="save()">
          <div class="page-content-white">
            <div class="form-group">
              <q-input v-model="item.name"
                       dense
                       hide-bottom-space
                       filled
                       label="Name"
                       :rules="[val => !!val || 'Field is required']"
                       required
              />
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
    name: 'EditCategory',
    props: ['id'],
    data() {
      return {
        item: {
          id: 0,
          name: '',
        },
      };
    },
    mounted() {
      if(this.id) {
        this.item.id = this.id
      }

      if(this.item.id){
        this.get();
      }
    },
    methods: {
      save() {
        this.axiosPost('/category/' + (this.item.id ? this.item.id : ''), this.item, (r) => {
          this.item = r.data

          this.$q.notify({
            message: 'Category saved!',
            type: 'positive',
          });

          this.onOKClick()
        });
      },
      get() {
        this.axiosGet('/category/' + this.item.id, (r) => {
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
