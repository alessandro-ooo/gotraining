import Button from "../../buttons/button";
import DialogManager from "../DialogManager";
import { useTranslation } from "react-i18next";

type DialogContentGenericProps = {
  show: boolean;
  title: string;
  content: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
};

const DialogContentGeneric = ({
  onCancel,
  onConfirm,
  show,
  content,
  title,
}: DialogContentGenericProps) => {
  const { t } = useTranslation();

  return (
    <DialogManager
      show={show}
      content={content}
      title={title}
      options={[
        <Button variant="secondary" onClick={() => onConfirm()}>
          {t("generalInputs.confirm")}
        </Button>,
        <Button variant="tertiary" onClick={() => onCancel()}>
          {t("generalInputs.discard")}
        </Button>,
      ]}
    />
  );
};

export default DialogContentGeneric;
