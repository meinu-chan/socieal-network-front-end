import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { Suspense, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Loader from '../components/Loader';
import SignIn from '../containers/Authentication/SignIn';
import SignUp from '../containers/Authentication/SignUp';
import Setting from '../containers/Setting';
import User from '../containers/User';
import { scrollToTop } from '../helpers/common';
import NotFound from '../router/NotFound';
import PrivateRoute from '../router/PrivateRoute';
import { appLinks } from '../router/routes';
import { emit } from '../socket';
import { useAppContext } from '../store';
interface IPrivateRoute {
  path: string;
  element: JSX.Element;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingTop: '0',
  },
}));

const privateRoutes: IPrivateRoute[] = [{ path: appLinks.setting.link, element: <Setting /> }];

function Layout() {
  const classes = useStyles();

  const {
    state: { isAuth, user },
  } = useAppContext();

  useEffect(() => {
    scrollToTop();
  }, []);

  useEffect(() => {
    if (isAuth) emit({ event: 'connect', payload: user._id });
  }, [isAuth, user._id, user]);

  return (
    <Suspense fallback={<Loader fullScreen />}>
      <div className={classes.root}>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Routes>
            <Route path="/" element={<Navigate to={appLinks.login.link} />} />
            <Route path={appLinks.login.link} element={<SignIn />} />
            <Route path={appLinks.registration.link} element={<SignUp />} />
            <Route path={`${appLinks.index.link}:userId`} element={<User />} />

            {privateRoutes.map(({ path, element }) => (
              <Route path={path} key={path} element={<PrivateRoute isAuthenticated={isAuth} />}>
                <Route path={path} element={element} />
              </Route>
            ))}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Suspense>
  );
}

export default Layout;
