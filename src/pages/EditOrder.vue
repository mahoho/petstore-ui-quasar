<template>
  <q-dialog :value="true"
            ref="dialog"
            persistent>
    <q-card class="edit-page edit-user-page">
      <q-card-section>
        <div class="page-subtitle">
          {{ item.id ? 'Edit' : 'New' }} Order #{{ item.id }}
        </div>

        <form class="page-content"
              @submit.prevent="save()">
          <div class="page-content-white">
            <div class="form-group">
              <q-select v-model="item.petId"
                        dense
                        hide-bottom-space
                        filled
                        label="Pet"
                        map-options
                        emit-value
                        options-dense
                        option-label="name"
                        option-value="id"
                        :options="pets"
                        :rules="[val => !!val || 'Field is required']"
                        required
              />
            </div>
            <div class="form-group">
              <q-input v-model="item.quantity"
                       dense
                       type="number"
                       min="1"
                       hide-bottom-space
                       filled
                       label="Quantity"
                       options-dense
                       :options="pets"
                       :rules="[val => !!val || 'Field is required']"
                       required
              />
            </div>

            <div class="form-group">
              <q-input filled
                       dense
                       hide-bottom-space
                       v-model="item.shipDate"
                       :rules="[val => !!val || 'Field is required']"
              >
                <template v-slot:prepend>
                  <q-icon name="far fa-calendar" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date v-model="item.shipDate" mask="YYYY-MM-DD[T]HH:mm:ss.SS[Z]">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat dense />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>

                <template v-slot:append>
                  <q-icon name="far fa-clock" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-time v-model="item.shipDate" mask="YYYY-MM-DD[T]HH:mm:ss.SS[Z]" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat dense/>
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <div class="form-group">
              <q-select v-model="item.status"
                        dense
                        filled
                        hide-bottom-space
                        options-dense
                        label="Status"
                        :rules="[val => !!val || 'Field is required']"
                        :options="statuses"
              />
            </div>
            <div class="form-group">
              <q-select v-model="item.complete"
                        dense
                        filled
                        hide-bottom-space
                        options-dense
                        map-options
                        emit-value
                        label="Complete"
                        :options="[
                            {value: true, label: 'Complete'},
                            {value: false, label: 'Not Complete'},
                        ]"
              />
            </div>
          </div>
        </form>
      </q-card-section>
      <q-card-actions align="right">
        <button type="button"
                @click="hide()"
                class="button button-grey q-mr-md">
          Close
          <q-icon name="ion-ios-close-circle-outline"></q-icon>
        </button>
        <button class="button button-primary"
                @click="save">
          {{ item.id ? 'Update' : 'Create' }}
          <q-icon name="ion-ios-checkmark-circle"></q-icon>
        </button>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>

export default {
  name: 'EditOrder',
  props: ['id'],
  data() {
    return {
      item: {
        id: 0,
        petId: null,
        quantity: 1,
        shipDate: null,
        status: null,
        complete: false,
      },
      pets: []
    };
  },
  mounted() {
    if (this.id) {
      this.item.id = this.id
    }

    if (this.item.id) {
      this.get();
    }

    this.getPets()
  },
  methods: {
    getPets() {
      this.axiosGet('/pet', (r) => {
        this.pets = r.data;
      }, false);
    },
    save() {
      this.axiosPost('/store/order/' + (this.item.id ? this.item.id : ''), this.item, (r) => {
        this.item = r.data

        this.$q.notify({
          message: 'Order saved!',
          type: 'positive',
        });

        this.onOKClick()
      });
    },
    get() {
      this.axiosGet('/store/order/' + this.item.id, (r) => {
        this.item = r.data;
      });
    },

    // following method is REQUIRED
    // (don't change its name --> "show")
    show() {
      this.$refs.dialog.show()
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide() {
      this.$refs.dialog.hide()
    },

    onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit('hide')
    },

    onOKClick() {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      this.$emit('ok')
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide()
    },

    onCancelClick() {
      // we just need to hide dialog
      this.hide()
    }
  },
  computed: {
    statuses() {
      return this.$store.state.mainStore.ordersStatuses
    }
  }
};
</script>

<style scoped>

</style>
