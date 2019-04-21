import axios from '../plugins/axios'

export const state = () => {

    return {
        policy: null
    }
};
export const mutations = {
    FETCH_ALL_SIGN_AND_POLICY() {
        console.log('Fetching all Signature and Policy...')
    },
    FETCH_ALL_SIGN_AND_POLICY_SUCCESS(state, data) {
        state.policy = data;
    },
    FETCH_ALL_SIGN_AND_POLICY_FAILURE(state, error) {
        console.error(error);
    },

    UPLOADING_FILE() {
        console.log('Uploading File...')
    },
    UPLOADING_FILE_SUCCESS(state, data) {
        state.file = state.policy.url + '/' + state.policy.key;
        state.key = state.policy.key;
        state.responce = data;
    },
    UPLOADING_FILE_FAILURE(state, error) {
        console.error(error);
    },
};
export const actions = {
    async fetchSignatureAndPolicy({ state, commit }, payload) {
        try {
            commit('FETCH_ALL_SIGN_AND_POLICY')
            let { data } = await axios.get(`/signature_and_policy?content_type=${payload.type}&filename=${payload.name}&for_resume=true`, {

            });
            commit('FETCH_ALL_SIGN_AND_POLICY_SUCCESS', data)
        } catch (error) {
            commit('FETCH_ALL_SIGN_AND_POLICY_FAILURE', error)
        }
    },
    async upload({ state, commit }, payload) {
        try {
            commit('UPLOADING_FILE')
            let { data } = await axios.post(`https://s3-ap-southeast-1.amazonaws.com/quasar-test-th`, payload)
            commit('UPLOADING_FILE_SUCCESS', data, payload)
        } catch (error) {
            commit('UPLOADING_FILE_FAILURE', error)
        }
    },

}

export default ({ Vue }) => {
    Vue.prototype.$actions = actions
  }