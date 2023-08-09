export interface UserData {
    _id: string,
    username: string,
    status: boolean,
    profilePicUrl: string,
    name: string,
    mobile: number,
    following: string[],
    followers: string[],
    email: string,
    createdAt: Date,
    blockedUser: string[],
    bio: string
}

export interface LoginForm {
    usernameOrEmail: string,
    password: string
}

export interface SignupForm {
    username: string,
    name: string,
    email: string,
    mobile: number,
    password: string
}