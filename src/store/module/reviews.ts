import { getReviewById, getReviews } from '@/api/reviews'
import { supabase } from '@/supabase'

const state = () => ({
  reviews: <any>[],
  reviewsSubscriber: <any>{},
})

const getters = {
  reviews: (state: { reviews: [] }) => state.reviews,
  totalReviews: (state: { reviews: [] }) => state.reviews.length,
  latestReviews: (state: { reviews: [] }) => state.reviews.slice(0, 5),
  getReviewsById: (state: { reviews: [] }) => (id: number) => {
    return state.reviews.filter((review: any) => review.bottleId === id)
  },
}

const actions = {
  fetchReviews: async ({ state, commit }: any) => {
    try {
      let { data, error, status } = await getReviews()
      if (error && status !== 406) throw error
      if (data) {
        const reviews = data.map((review) => ({
          id: review.id,
          bottleId: review.bottle_id,
          rating: review.rating,
          comment: review.comment,
          date: review.date_added,
          ...review.bottles,
          ...review.profiles,
        }))

        commit('SET_REVIEWS', reviews)
        state.reviewsSubscriber = supabase
          .from('reviews')
          .on('*', async (payload) => {
            console.log('Change received!', payload)
            switch (payload.eventType) {
              case 'INSERT':
                const bottleData = await getReviewById(payload.new.id)
                if (bottleData.data) {
                  const bottleReview = {
                    ...payload.new,
                    ...bottleData.data[0].bottles,
                    ...bottleData.data[0].profiles,
                  }
                  commit('ADD_REVIEW', bottleReview)
                }
                break
              case 'UPDATE':
                commit('MODIFY_REVIEW', payload.new)
                return
              case 'DELETE':
                commit('DELETE_REVIEW', payload.new.id)
                break
            }
          })
          .subscribe()
      }
    } catch (error: any) {
      alert(error.message)
    }
  },
  unsuscribeReviews: ({ state }: any) => {
    supabase.removeSubscription(state.reviewsSubscriber)
  },
  destroyCellar: async ({ dispatch, commit }: any) => {
    dispatch('unsuscribeReviews')
    commit('RESET_REVIEWS')
  },
}

const mutations = {
  SET_REVIEWS: (state: { reviews: any[] }, reviews: any[]) => {
    state.reviews = reviews
  },
  RESET_REVIEWS: (state: { reviews: never[] }) => {
    state.reviews = []
  },
  ADD_REVIEW: (state: { reviews: any[] }, review: {}) => {
    state.reviews.push(review)
  },
  MODIFY_REVIEW: (
    state: { reviews: any[] },
    review: { id: number; rating: number; comment: string }
  ) => {
    let reviewFinded = state.reviews.find((item: any) => {
      return review.id === item.id
    })
    reviewFinded.rating = review.rating
    reviewFinded.comment = review.comment
  },
  DELETE_REVIEW: (state: { reviews: any[] }, id: number) => {
    state.reviews = state.reviews.filter((item: any) => {
      return item.id !== id
    })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
