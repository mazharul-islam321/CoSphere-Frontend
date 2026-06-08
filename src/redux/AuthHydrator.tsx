'use client';

import React, { useEffect } from 'react';
import { useAppDispatch } from './store';
import { useGetMeQuery } from './api/authApi';
import { setCredentials, clearCredentials, setAuthLoading } from './features/authSlice';

export const AuthHydrator = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { data, isLoading, isSuccess, isError } = useGetMeQuery();

  useEffect(() => {
    if (isLoading) {
      dispatch(setAuthLoading(true));
    } else if (isSuccess && data?.user) {
      dispatch(setCredentials(data.user));
    } else if (isError) {
      dispatch(clearCredentials());
    }
  }, [data, isLoading, isSuccess, isError, dispatch]);

  return <>{children}</>;
};

export default AuthHydrator;
