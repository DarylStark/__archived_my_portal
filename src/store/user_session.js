// Store to save user session information
export default {
    state() {
        return {
            user_fullname: null,
            session: null
        }
    },
    mutations: {
        set_session(state, session) {
            state.session = {
                account: session.user_account,
                session: session.session
            }
        }
    }
};
