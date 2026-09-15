import { WifiOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Banner } from "./OfflineBannerStyles";

const OfflineBanner = () => {
  const { t } = useTranslation();

  return (
    <Banner role="alert">
      <WifiOff size={18} />
      {t("alerts.offline")}
    </Banner>
  );
};

export default OfflineBanner;
