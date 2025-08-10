import { FC } from 'react';
import Dashboard from '../../components/Dashboard/Dashboard';
import { User } from '../../types/types';

interface HomeProps {
  user: User;
}

const HomePage: FC<HomeProps> = ({ user }) => {
  return <Dashboard user={user} />;
};

export default HomePage;
