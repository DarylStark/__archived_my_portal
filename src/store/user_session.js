// Store to save user session information

import api from '../my/api';
import APICommand from '../my/api_command';

export default {
    state() {
        return {
            user_fullname: null,
            session: null,
            session_error: null
        }
    },
    mutations: {
        set_password_date(state, date) {
            state.session.account['password_date'] = date;
        },
        get_user_session(state, callback = null) {
            api.execute(
                new APICommand(
                    'user_sessions',
                    'current',
                    'GET',
                    null,
                    (data) => {
                        // We have the details. Let's save the user account and the
                        // session to the store for later user
                        state.session = {
                            account: data.data.user_account,
                            session: data.data.session
                        }

                        // Run the callback, if set
                        if (callback) callback();
                    },
                    (error) => {
                        // Something went wrong. We set the error in the store
                        // so the Splash Screen knows not to go away
                        state.session = null;
                        state.session_error = error;
                    }
                )
            );
        }
    }
};
