import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type DialogManagerProps = {
  trigger: React.ReactNode;
  content: React.ReactNode;
  description?: string;
  title: string;
  options: React.ReactNode[];
};

const DialogManager = ({
  trigger,
  content,
  title,
  description,
  options,
}: DialogManagerProps) => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="bg-zinc-900 text-white border-zinc-950">
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
                "w-full justify-center sm:justify-center items-center"
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
