import { createSelector } from "reselect";

// types

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    }
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string
  }
};

export type Payload = {
  users?: User[];
  error?: Error;
};

export type UsersAction = {
  type: string;
  payload?: Payload;
  error?: Error;
};

export type UsersState = {
  users: User[];
  pending: boolean;
  error: Error | null;
};

// constants
const reducerName = "users";
const FETCH_USERS_REQUEST = `${reducerName}/FETCH_USERS_REQUEST`;
const FETCH_USERS_CANCEL = `${reducerName}/FETCH_USERS_CANCEL`;
const FETCH_USERS_SUCCESS = `${reducerName}/FETCH_USERS_SUCCESS`;
const FETCH_USERS_FAILURE = `${reducerName}/FETCH_USERS_FAILURE`;

// actions
const loadUsersRequest = (): UsersAction => ({
  type: FETCH_USERS_REQUEST,
});

const loadUsersCancel = (): UsersAction => ({
  type: FETCH_USERS_CANCEL,
});

const loadUsersSuccess = (users: User[]): UsersAction => ({
  type: FETCH_USERS_SUCCESS,
  payload: { users },
});

const loadUsersFailure = (error: Error): UsersAction => ({
  type: FETCH_USERS_FAILURE,
  payload: { error },
});

// reducer
const initialState: UsersState = {
  users: [],
  pending: false,
  error: null,
};

const reducer = (state = initialState, action: UsersAction) => {
  const { type, payload, error } = action;

  switch (type) {
    case FETCH_USERS_REQUEST: {
      return {
        ...state,
        pending: true,
      };
    }
    case FETCH_USERS_SUCCESS: {
      return {
        ...state,
        pending: false,
        users: payload?.users ?? [],
      };
    }
    case FETCH_USERS_FAILURE: {
      return {
        ...state,
        pending: false,
        error,
      };
    }
    default: {
      return state;
    }
  }
};

// selectors
const getUsersState = ({ users }: { users: UsersState }) => users;
const getAllUsersFromState = createSelector(
  getUsersState,
  ({ users }: UsersState) => users
);
const getIsPending = createSelector(
  getUsersState,
  ({ pending }: UsersState) => pending
);
const getError = createSelector(
  getUsersState,
  ({ error }: UsersState) => error
);

const usersState = {
  actions: {
    loadUsersRequest,
    loadUsersCancel,
    loadUsersSuccess,
    loadUsersFailure,
  },
  types: {
    FETCH_USERS_REQUEST,
    FETCH_USERS_CANCEL,
    FETCH_USERS_SUCCESS,
    FETCH_USERS_FAILURE,
  },
  selectors: {
    getAllUsersFromState,
    getError,
    getIsPending,
  },
  name: reducerName,
  reducer,
};

export default usersState;
