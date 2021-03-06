<template>
  <h2
    class="
      mt-6
      text-2xl
      font-semibold
      text-gray-700
      dark:text-gray-200
      items-center
      justify-between
      pb-2
      flex
      md:hidden
    "
  >
    <span
      >{{ bottle?.name }}
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ bottle?.cellar }}
      </p>
    </span>
    <button
      class="
        text-pink-900
        bg-transparent
        border border-solid border-pink-900
        hover:bg-pink-900 hover:text-white
        active:bg-pink-700
        font-bold
        uppercase
        text-xs
        px-4
        py-2
        rounded
        outline-none
        focus:outline-none
        mr-1
        mb-1
        ease-linear
        transition-all
        duration-150
      "
      type="button"
      @click="$router.back()"
    >
      {{ $t('general.back') }}
    </button>
  </h2>
  <div class="grid gap-6 mb-6 md:my-6 md:grid-cols-3">
    <div class="min-w-0 p-4 bg-white shadow-lg rounded dark:bg-gray-800">
      <img
        aria-hidden="true"
        class="w-auto max-h-80 m-auto"
        :src="bottle.image"
        v-if="bottle?.image"
      />
      <img
        aria-hidden="true"
        class="w-auto max-h-80 m-auto"
        src="../assets/img/bottle-empty.jpg"
        v-else
      />
    </div>
    <div
      class="
        min-w-0
        p-6
        bg-white
        shadow-lg
        rounded
        dark:bg-gray-800
        md:col-span-2
        flex flex-col
        justify-between
      "
    >
      <h2
        class="
          mb-4
          text-2xl
          font-semibold
          text-gray-700
          dark:text-gray-200
          items-center
          justify-between
          pb-4
          border-b-2
          hidden
          md:flex
        "
      >
        <span
          >{{ bottle?.name }}
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ bottle?.cellar }}
          </p>
        </span>
        <button
          @click="$router.back()"
          class="
            inline-block
            text-sm
            px-4
            py-2
            leading-none
            border
            rounded
            text-white
            border-pink-900
            bg-pink-900
            hover:bg-transparent hover:text-pink-800
            ml-4
            lg:mt-0
            ease-linear
            transition-all
            duration-150
          "
        >
          {{ $t('general.back') }}
        </button>
      </h2>
      <div class="my-4">
        <div class="text-md text-gray-500 dark:text-gray-400">
          <span v-if="bottle?.apellation">{{ bottle?.apellation }} - </span
          ><span class="font-bold">{{ bottle?.vintage }}</span>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">
          {{ bottle?.grapes?.join(', ') }}
        </p>
        <div class="text-xs mt-6">
          <WineTag :type="bottle?.type" />
        </div>
      </div>

      <div class="flex justify-between items-center pt-4 border-t-2">
        <div>
          <button
            class="
              text-pink-900
              bg-transparent
              hover:text-pink-700
              active:text-pink-600
              font-bold
              uppercase
              text-xl
              mr-6
            "
            type="button"
            @click="toggleEditBottle()"
            v-if="isAdmin"
          >
            <font-awesome-icon icon="edit" />
          </button>
        </div>

        <div class="h-8 w-24 m-left">
          <QtySelector
            :qty="bottle?.qty"
            v-on:incrementQty="increaseQty(bottle?.id)"
            v-on:decrementQty="decreaseQty(bottle?.id)"
          />
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="bottle?.description"
    class="min-w-0 p-4 bg-white shadow-lg rounded dark:bg-gray-800"
  >
    <h4 class="mb-4 font-semibold text-lg text-blueGray-700">
      {{ $t('cellar.description') }}
    </h4>
    <p class="text-gray-600 dark:text-gray-400 text-sm">
      {{ bottle?.description }}
    </p>
  </div>

  <div class="min-w-0 p-4 mt-6 bg-white shadow-lg rounded dark:bg-gray-800">
    <h4 class="mb-4 font-semibold text-lg text-blueGray-700">
      {{ $t('cellar.details') }}
    </h4>

    <table class="w-full whitespace-no-wrap">
      <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
        <tr
          class="text-gray-700 dark:text-gray-400 border-b"
          v-if="bottle?.name"
        >
          <td class="pr-4 py-3">
            <div class="flex items-center text-sm font-semibold">
              {{ $t('cellar.name') }}
            </div>
          </td>
          <td class="px-4 py-3 text-sm">{{ bottle?.name }}</td>
        </tr>
        <tr
          class="text-gray-700 dark:text-gray-400 border-b"
          v-if="bottle?.cellar"
        >
          <td class="pr-4 py-3">
            <div class="flex items-center text-sm font-semibold">
              {{ $t('cellar.cellar') }}
            </div>
          </td>
          <td class="px-4 py-3 text-sm">{{ bottle?.cellar }}</td>
        </tr>
        <tr
          class="text-gray-700 dark:text-gray-400 border-b"
          v-if="bottle?.vintage"
        >
          <td class="pr-4 py-3">
            <div class="flex items-center text-sm font-semibold">
              {{ $t('cellar.vintage') }}
            </div>
          </td>
          <td class="px-4 py-3 text-sm">{{ bottle?.vintage }}</td>
        </tr>
        <tr
          class="text-gray-700 dark:text-gray-400 border-b"
          v-if="bottle?.country"
        >
          <td class="pr-4 py-3">
            <div class="flex items-center text-sm font-semibold">
              {{ $t('cellar.country') }}
            </div>
          </td>
          <td class="px-4 py-3 text-sm">{{ bottle?.country }}</td>
        </tr>
        <tr
          class="text-gray-700 dark:text-gray-400 border-b"
          v-if="bottle?.region"
        >
          <td class="pr-4 py-3">
            <div class="flex items-center text-sm font-semibold">
              {{ $t('cellar.region') }}
            </div>
          </td>
          <td class="px-4 py-3 text-sm">{{ bottle?.region }}</td>
        </tr>
        <tr
          class="text-gray-700 dark:text-gray-400 border-b"
          v-if="bottle?.apellation"
        >
          <td class="pr-4 py-3">
            <div class="flex items-center text-sm font-semibold">
              {{ $t('cellar.apellation') }}
            </div>
          </td>
          <td class="px-4 py-3 text-sm">{{ bottle?.apellation }}</td>
        </tr>
        <tr
          class="text-gray-700 dark:text-gray-400 border-b"
          v-if="bottle?.type"
        >
          <td class="pr-4 py-3">
            <div class="flex items-center text-sm font-semibold">
              {{ $t('cellar.type') }}
            </div>
          </td>
          <td class="px-4 py-3 text-xs"><WineTag :type="bottle.type" /></td>
        </tr>
        <tr
          class="text-gray-700 dark:text-gray-400 border-b"
          v-if="bottle?.grapes"
        >
          <td class="pr-4 py-3">
            <div class="flex items-center text-sm font-semibold">
              {{ $t('cellar.grapes') }}
            </div>
          </td>
          <td class="px-4 py-3 text-sm">
            {{ bottle?.grapes.join(', ') }}
          </td>
        </tr>

        <tr
          class="text-gray-700 dark:text-gray-400 border-b"
          v-if="bottle?.alcohol_content"
        >
          <td class="pr-4 py-3">
            <div class="flex items-center text-sm font-semibold">
              {{ $t('cellar.alcoholContent') }}
            </div>
          </td>
          <td class="px-4 py-3 text-sm">{{ bottle?.alcohol_content }}</td>
        </tr>
        <tr
          class="text-gray-700 dark:text-gray-400 border-b"
          v-if="bottle?.climate_soil"
        >
          <td class="pr-4 py-3">
            <div class="flex items-center text-sm font-semibold">
              {{ $t('cellar.climateSoil') }}
            </div>
          </td>
          <td class="px-4 py-3 text-sm">{{ bottle?.climate_soil }}</td>
        </tr>
        <tr
          class="text-gray-700 dark:text-gray-400 border-b"
          v-if="bottle?.consumption"
        >
          <td class="pr-4 py-3">
            <div class="flex items-center text-sm font-semibold">
              {{ $t('cellar.consumption') }}
            </div>
          </td>
          <td class="px-4 py-3 text-sm">{{ bottle?.consumption }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div
    class="
      relative
      flex flex-col
      min-w-0
      break-words
      w-full
      mb-6
      shadow-lg
      rounded
      bg-white
      mt-6
    "
  >
    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full max-w-full flex-grow flex-1">
          <h3 class="font-semibold text-lg text-blueGray-700">Reviews</h3>
        </div>
      </div>
    </div>
    <div class="block w-full overflow-x-auto">
      <div
        class="
          w-full
          bg-transparent
          border-collapse
          mb-6
          px-4
          py-3
          flex flex-col
          lg:flex-row
          items-start
        "
      >
        <div class="w-full lg:w-2/3 mr-8">
          <ReviewList :bottleId="bottle.id" v-if="bottle" />
        </div>
        <div class="w-full lg:w-1/3">
          <ReviewForm :bottleId="bottle.id" v-if="bottle" />
        </div>
      </div>
    </div>
  </div>

  <Scraper :bottle="bottle" v-if="isAdmin && bottle" />

  <teleport to="#beforeBodyEnd">
    <BottleForm
      v-if="editBottle"
      @closeModalForm="toggleEditBottle()"
      :bottle="bottle"
    />
  </teleport>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { mapActions, mapGetters } from 'vuex'
  import { Bottle } from '@/models/cellar'
  import WineTag from '../components/Bottle/WineTag.vue'
  import Scraper from '@/components/Bottle/Scraper.vue'
  import ReviewList from '@/components/Bottle/ReviewList.vue'
  import ReviewForm from '@/components/Bottle/ReviewForm.vue'
  import QtySelector from '@/components/Bottle/QtySelector.vue'
  import BottleForm from '@/components/Cellar/BottleForm.vue'

  export default defineComponent({
    name: 'Bottle',
    components: {
      WineTag,
      Scraper,
      QtySelector,
      ReviewList,
      BottleForm,
      ReviewForm,
    },
    data: () => ({
      id: 0,
      editBottle: false,
    }),
    async mounted() {
      this.id = parseInt(<any>this.$route.params.id)
    },
    computed: {
      ...mapGetters({
        getBottles: 'bottles/bottles',
        isAdmin: 'user/isAdmin',
      }),
      bottle() {
        return this.getBottles.find((bottle: Bottle) => bottle.id === this.id)
      },
    },
    watch: {},
    methods: {
      ...mapActions({
        addMessage: 'general/addMessage',
        increaseBottleQty: 'bottles/increaseBottleQty',
        decreaseBottleQty: 'bottles/decreaseBottleQty',
      }),
      increaseQty(id: number) {
        this.increaseBottleQty({ bottleId: id, qty: this.bottle.qty! })
      },
      decreaseQty(id: number) {
        this.decreaseBottleQty({ bottleId: id, qty: this.bottle.qty! })
      },
      toggleEditBottle() {
        this.editBottle = !this.editBottle
      },
    },
  })
</script>
