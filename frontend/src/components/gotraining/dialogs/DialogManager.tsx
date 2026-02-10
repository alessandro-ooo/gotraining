import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type DialogManagerProps = {
  show: boolean;
  content: React.ReactNode;
  description?: string;
  title: string;
  options: React.ReactNode[];
};

const DialogManager = ({
  show,
  content,
  title,
  description,
  options,
}: DialogManagerProps) => {
  return (
    <Dialog open={show}>
      <form>
        <DialogContent
          showCloseButton={false}
          className="bg-zinc-900 text-white border-zinc-950 min-w-14"
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {!!description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          {content}
          <DialogFooter
            className={cn(
              options.length === 1 &&
                "w-full justify-center sm:justify-center items-center",
            )}
          >
            {options.length === 1 && (
              <DialogClose asChild>{options[0]}</DialogClose>
            )}

            {options.length > 1 && (
              <>
                <DialogClose asChild>{options[0]}</DialogClose>
                {options.slice(1).map((option) => (
                  <>{option}</>
                ))}
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default DialogManager;
