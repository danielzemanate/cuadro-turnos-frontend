import { FC } from 'react';
import { Content, Layout } from './LayoutStyled';
import { IChildrenProps } from '../interfaces/shared';
import HeaderComponent from '../components/Header/Header';
import { useLocation } from 'react-router-dom';

const MainLayout: FC<IChildrenProps> = ({ children }) => {
  const location = useLocation();

  // Aquí deberías usar Redux o Context en el futuro
  const user = {
    id: 1,
    nombre: 'Valery J. Rivera L.',
    rol: 'Médico',
  };

  const hideLayoutForPaths = ['/', '/login'];

  const showHeader = user && !hideLayoutForPaths.includes(location.pathname);

  const handleLogout = () => {
    console.log('Cerrando sesión desde MainLayout...');
    // lógica de logout
  };

  return (
    <Layout>
      {showHeader && <HeaderComponent userName={user.nombre} userRole={user.rol} onLogout={handleLogout} />}
      <Content>{children}</Content>
    </Layout>
  );
};

export default MainLayout;
