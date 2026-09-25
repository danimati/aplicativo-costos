export interface NavLeaf {
  id: string;
  label: string;
  route: string;
}

export interface NavCycle {
  id: string;
  label: string;
  leaves: NavLeaf[];
}
