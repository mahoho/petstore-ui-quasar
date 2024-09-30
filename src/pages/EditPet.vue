<template>
  <q-dialog :value="true"
            ref="dialog"
            persistent>
    <q-card class="edit-page edit-user-page">
      <q-card-section>
        <div class="page-subtitle">
          {{ item.id ? 'Edit' : 'New' }} Pet #{{ item.id }}
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
          <div class="form-group">
            <q-select v-model="item.status"
                      dense
                      hide-bottom-space
                      filled
                      :options="statuses"
                      label="Status"
                      :rules="[val => !!val || 'Field is required']"
                      required
            />
          </div>
          <div class="form-group">
            <q-select v-model="item.category"
                      dense
                      hide-bottom-space
                      filled
                      option-label="name"
                      :options="categories"
                      label="Category"
                      :rules="[val => !!val || 'Field is required']"
                      required
            />
          </div>
          <div class="form-group">
            <q-select v-model="item.tags"
                      dense
                      hide-bottom-space
                      filled
                      multiple
                      use-chips
                      option-label="name"
                      :options="tags"
                      label="Tags"
                      :rules="[val => !!val || 'Field is required']"
                      required
            />
          </div>
          <div class="form-group"
               v-if="item.id">
            <q-file v-model="file"
                    dense
                    hide-bottom-space
                    filled
                    label="Upload Image"
                    @input="uploadImage"/>
            <div class="images">
              <div class="image"
                   :key="index"
                   v-for="(image, index) in (item.photoUrls || [])">
                <q-img :src="$apiUrl + image" style="width: 150px"  />

                <q-btn dense
                       flat
                       icon="fas fa-times"
                       @click="removeImage(index)"/>
              </div>

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
  name: 'EditPet',
  props: ['id'],
  data() {
    return {
      item: {
        id: 0,
        name: '',
        category: null,
        photoUrls: [],
        tags: [],
      },
      file: null,
      categories: [],
      tags: [],
    };
  },
  mounted() {
    if (this.id) {
      this.item.id = this.id
    }

    if (this.item.id) {
      this.get();
    }

    this.getCategories()
    this.getTags()
  },
  methods: {
    getCategories() {
      this.axiosGet('/category', r => {
        this.categories = r.data;
      }, false)
    },
    getTags() {
      this.axiosGet('/tag', r => {
        this.tags = r.data;
      }, false)
    },
    removeImage(index) {
      this.item.photoUrls.splice(index, 1);
    },
    uploadImage() {
      let formData = new FormData();
      formData.append('image', this.file);

      this.axiosPost('/pet/' + this.item.id + '/uploadImage', formData, r => {
        this.notify('Image uploaded')

        this.get(r => {
          this.item.photoUrls = r.data.photoUrls;
        })
      })
    },
    save() {
      this.axiosPost('/pet/' + (this.item.id ? this.item.id : ''), this.item, (r) => {
        this.item = r.data

        this.$q.notify({
          message: 'Pet saved!',
          type: 'positive',
        });

        this.onOKClick()
      });
    },
    get(callback) {
      let c = callback || ((r) => {
        this.item = r.data
      })

      this.axiosGet('/pet/' + this.item.id, c);
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
    statuses(){
      return this.$store.state.mainStore.petsStatuses
    }
  }
};
</script>

<style scoped>
.images {
  display: flex;
  flex-flow: row wrap;
  gap: 10px;
}

.images .image {
  display: flex;
  align-items: flex-start;
}
</style>
