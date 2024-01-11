import {api} from '@src/services/api';
import * as logging from '@src/services/logging';
import {setCarrierUsers} from '@src/store/carrier/myLoadCarrierSlice';
import {DebugLevel} from '@src/store/logs/appLogsSlice';

export const driverApi = api.injectEndpoints({
  endpoints: build => ({
    getUsers: build.query({
      query: () => '/fr8match/profile/managed?includeMe=false',
      async onQueryStarted(_id, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          dispatch(setCarrierUsers(data));
        } catch (err) {
          logging.appLogger('Error fetching users...', DebugLevel.info);
          logging.appLogger(err, DebugLevel.error, 'drivers.ts', 'getUsers');
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const {useGetUsersQuery, useLazyGetUsersQuery} = driverApi;

export const {
  endpoints: {getUsers},
} = driverApi;
