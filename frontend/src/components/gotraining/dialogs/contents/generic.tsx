import GTButton from "../../buttons/button";
import DialogManager from "../DialogManager";

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
  return (
    <DialogManager
      show={show}
      content={content}
      title={title}
      description={description}
      options={[
        <GTButton
          variant="secondary"
          text="Va bene"
          onClick={() => onConfirm()}
        />,
        <GTButton
          variant="tertiary"
          text="Annulla"
          onClick={() => onCancel()}
        />,
      ]}
    />
  );
};

export default DialogContentGeneric;
