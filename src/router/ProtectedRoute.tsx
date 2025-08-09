import { FC, Fragment } from 'react';
import { Navigate } from 'react-router-dom';
import { IPrivateRoute } from '../interfaces/shared';

const ProtectedRoute: FC<IPrivateRoute> = ({ isAllowed, children }) => {
  return isAllowed ? <Fragment>{children}</Fragment> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
