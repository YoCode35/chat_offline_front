import type { User } from "../models/User.model";

export type SocketType = "CONNEXION" | "USER_MESSAGE";

export interface UserMessagePayload {
  conversationId: number;
  author: User;
  message: string;
}

interface BaseSocketMessage<T extends SocketType, P> {
  type: T;
  payload: P;
}

export type ConnexionNotif = BaseSocketMessage<"CONNEXION", User>;
export type UserMessage = BaseSocketMessage<"USER_MESSAGE", UserMessagePayload>;

// Union of all socket messages
export type SocketMessage = ConnexionNotif | UserMessage;
