export interface OverallMessage{
    _id: string,
    type: 'text' | 'post' | 'profile',
    to: string,
    sendAt: Date,
    seen: boolean,
    newMessageCount: number,
    mood: Mood,
    messageId: string,
    from: string,
    content: string,
    foreignUser: {
        bio: string,
        blockedStatus: boolean,
        name: string,
        profilePicUrl: string,
        username: string,
        _id: string
    }
}

export interface Message {
    _id: string,
    content: string,
    deletedUsers: [],
    from: string,
    mood: Mood,
    seen: boolean,
    sendAt: Date,
    to: string,
    type: 'text' | 'post' | 'profile'
}

export interface Mood {
    color: string,
    createdAt: Date,
    name: string,
    status: boolean,
    _id: string
}