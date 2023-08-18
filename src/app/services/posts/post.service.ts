import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from 'src/environments';
import { Comment, Post, Reply } from 'src/interfaces/post';
import { Message } from 'src/interfaces/message';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private http: HttpClient
  ) { }

  addPost({messages, withUserId, privacy}: {messages: Message[], withUserId: string, privacy: {whoCanReply: string, showSeen: boolean, showTime: boolean}}) {
    return this.http.post<Post[]>(`${API}/post/addPost`, {
      messages,
      withUserId,
      privacy
    })
  }

  getPosts(){
    return this.http.get<Post[]>(`${API}/post/getPosts`)
  }

  getPostsByUser(userId: string) {
    return this.http.get<Post[]>(`${API}/post/getPostsByUser?userId=${userId}`)
  }

  likePost({userId, postId}: {userId: string, postId: string}) {
    return this.http.patch<Post>(`${API}/post/likePost`, {userId, postId})
  }

  unlikePost({userId, postId}: {userId: string, postId: string}) {
    return this.http.patch<Post>(`${API}/post/unlikePost`, {userId, postId})
  }

  dislikePost({userId, postId}: {userId: string, postId: string}) {
    return this.http.patch<Post>(`${API}/post/dislikePost`, {userId, postId})
  }

  undislikePost({userId, postId}: {userId: string, postId: string}) {
    return this.http.patch<Post>(`${API}/post/undislikePost`, {userId, postId})
  }

  getPostDetails(postId: string) {
    return this.http.get<Post>(`${API}/post/postDetails?id=${postId}`);
  }

  getComments(postId: string) {
    return this.http.get<Comment[]>(`${API}/post/comments?postId=${postId}`)
  }

  postComment(commentData: Comment) {
    return this.http.post<Comment[]>(`${API}/post/comment`, commentData)
  }

  getReplies(postId: string) {
    return this.http.get<Reply[]>(`${API}/post/replies?postId=${postId}`)
  }

  sendReply(replyData: Reply) {
    return this.http.post<Reply>(`${API}/post/sendReply`, replyData)
  }

  blockPost(postId: string) {
    return this.http.get<boolean>(`${API}/post/postBlock`)
  }

  unblockPost(postId: string) {
    return this.http.get<boolean>(`${API}/post/postUnblock`)
  }

  deleteComment({postId, commentId}: {postId: string, commentId: string}) {
    return this.http.delete<boolean>(`${API}/post/deleteComment`)
  }
}
