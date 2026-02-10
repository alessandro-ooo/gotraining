import GTButton from "../../buttons/button";
import DialogManager from "../DialogManager";
import { useTranslation } from "react-i18next";

type DialogContentGenericProps = {
  show: boolean;
  title: string;
  description: string;
  content: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
};

const DialogContentGeneric = ({
  onCancel,
  onConfirm,
  show,
  content,
  description,
  title,
}: DialogContentGenericProps) => {
  const { t } = useTranslation();

  return (
    <DialogManager
      show={show}
      content={content}
      title={title}
      description={description}
      options={[
        <GTButton variant="secondary" onClick={() => onConfirm()}>
          {t("generalInputs.confirm")}
        </GTButton>,
        <GTButton variant="tertiary" onClick={() => onCancel()}>
          {t("generalInputs.discard")}
        </GTButton>,
      ]}
    />
  );
};

export default DialogContentGeneric;
