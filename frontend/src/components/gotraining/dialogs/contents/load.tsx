import { ScrollArea } from "@/components/ui/scroll-area";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import GTButton from "../../buttons/button";
import DialogManager from "../DialogManager";
import Icon from "../../icon/icon";
import { useTranslation } from "react-i18next";

type SavedItems = {
  name: string;
  lastModified: string;
};

type DialogContentLoadsProps = {
  show: boolean;
  onCancelClick: () => void;
  onLoadClick: () => void;
  onItemClick?: (index: number) => void;
  items: SavedItems[];
  selectedItemIndex?: number;
};

const DialogContentLoads = ({
  show,
  items,
  onItemClick,
  selectedItemIndex,
  onCancelClick,
  onLoadClick,
}: DialogContentLoadsProps) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const { t } = useTranslation();

  React.useEffect(() => {
    if (
      selectedItemIndex !== undefined &&
      selectedItemIndex >= 0 &&
      selectedItemIndex < items.length
    ) {
      setRowSelection({ [selectedItemIndex]: true });
    } else {
      setRowSelection({});
    }
  }, [selectedItemIndex, items.length]);

  const columns: ColumnDef<SavedItems>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <GTButton
            variant="table"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("dialogs.load.table.fileName")}
          </GTButton>
        );
      },
      cell: ({ row }) => (
        <div className="px-4">
          {<p className="font-normal ">{row.getValue("name")}</p>}
        </div>
      ),
    },
    {
      accessorKey: "lastModified",
      header: ({ column }) => {
        return (
          <GTButton
            variant="table"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("dialogs.load.table.lastModified")}
          </GTButton>
        );
      },
      cell: ({ row }) => (
        <div className="px-4">
          {<p className="font-normal ">{row.getValue("lastModified")}</p>}
        </div>
      ),
    },
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: items,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  return (
    <DialogManager
      show={show}
      content={
        <ScrollArea className="w-full rounded-md border p-4 h-[200px]">
          <Table className="w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    onClick={() => {
                      setRowSelection({ [row.index]: true });
                      onItemClick?.(row.index);
                    }}
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No Loads found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      }
      title={t("dialogs.load.title")}
      description={t("dialogs.load.description")}
      options={[
        <GTButton
          variant="default"
          disabled={selectedItemIndex === undefined}
          onClick={() => onLoadClick()}
        >
          <div className="flex flex-row gap-2">
            <p>{t("dialogs.load.inputs.confirm")}</p>
            <Icon name="load" color="#FFFFFF" />
          </div>
        </GTButton>,
        <GTButton variant="default" onClick={() => onCancelClick()}>
          {t("dialogs.load.inputs.discard")}
        </GTButton>,
      ]}
    />
  );
};

export default DialogContentLoads;
