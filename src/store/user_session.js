// Store to save user session information
export default {
    state() {
        return {
            user_fullname: null,
            session: null,
            session_error: null
        }
    },
    mutations: {
        set_session(state, session) {
            state.session = {
                account: session.user_account,
                session: session.session
            }
        },
        set_session_error(state, error) {
            state.session = null;
            state.session_error = error;
        },
        set_password_date(state, date) {
            state.session.account['password_date'] = date;
        }
    }
};
