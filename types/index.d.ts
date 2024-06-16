type MenuItemProps = {
  linkName: string;
  icon: JSX.Element;
};

interface Column {
  id: string;
  name: string;
  order: number;
  boardId: string;
}

interface Board {
  id: string;
  name: string;
  columns: Column[] | null;
}
