import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { HttpClient } from '@angular/common/http';
import { API } from 'src/environments';
import { UserData } from 'src/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private userService: UserService,
    private http: HttpClient
  ) { }

  follow(userId: string){
    return this.http.post<UserData>(`${API}/user/follow`, {
      followingUserId: this.userService.userData?._id,
      followedUserId: userId
    })
  }

  unfollow(userId: string){
    return this.http.post<UserData>(`${API}/user/unfollow`,{
      unfollowingUserId: this.userService.userData?._id,
      unfollowedUserId: userId
    })
  }

  getUsersList(keyword: string){
    return this.http.get<{users: UserData[]}>(`${API}/user/usersList?keyword=${keyword}`)
  }

  editUserProfile(data: FormData){
    return this.http.patch(`${API}/user/editProfile`,data)
  }
}
