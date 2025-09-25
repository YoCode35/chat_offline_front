export interface User {
  id: number;
  username: string;
  status?: "online" | "away" | "offline";
}
