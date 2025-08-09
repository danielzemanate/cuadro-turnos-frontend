import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Shared/Button/NormalButton/NormalButton';
import { Text, Title } from '../GlobalStyled';
import { NotFoundContainer } from './NotFoundComponentStyled';
import { useTranslation } from 'react-i18next';

const NotFoundComponent: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <NotFoundContainer>
      <Title>{t('notFound.notFoundPage')}</Title>
      <Text>{t('notFound.pageDoesNoExist')}</Text>
      <Button onClick={() => navigate('/')} text={t('notFound.goToHomepage')} />
    </NotFoundContainer>
  );
};

export default NotFoundComponent;
