import { Message } from "./message";

export interface Post {
    commentsCount: number,
    dislikes: string[],
    isContinous: boolean,
    likes: string[],
    messages: Message[],
    postedAt: Date,
    repliesCount: number,
    seenBy: string[],
    sharesCount: number,
    showSeen: boolean,
    showTime: boolean,
    status: boolean,
    userId: string,
    whoCanReply: string,
    withUserId: string,
    _id: string
}

export interface Comment {
    userId: string,
    postId: string,
    content: string
}

export interface Reply {
    userId: string,
    postId: string,
    content: string,
    mood: string
}