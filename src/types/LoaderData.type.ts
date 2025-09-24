import type { Conversation } from "../models/Conversation.model";
import type { User } from "../models/User.model";

export interface LoaderData {
  myConversations: Conversation[];
  uncontactedUsers: User[];
}
// { myConversations, uncontactedUsers }
