import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/pages/login/login.component';
import { InputComponent } from './components/general/input/input.component';
import { ButtonComponent } from './components/general/button/button.component';
import { LogoComponent } from './components/general/logo/logo.component';
import { FormsModule } from '@angular/forms';
import { GoogleLoginProvider } from 'angularx-social-login';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { NavbarComponent } from './components/fragments/navbar/navbar.component';
import { NavComponent } from './components/general/nav/nav.component';
import { MessagesComponent } from './components/pages/messages/messages.component';
import { SmallProfileComponent } from './components/general/small-profile/small-profile.component';
import { isLoggedOutGuard } from './guards/user/is-logged-out.guard';
import { isLoggedInGuard } from './guards/user/is-logged-in.guard';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { LoadingComponent } from './components/general/loading/loading.component';
import { MessageComponent } from './components/general/message/message.component';
import { TimePipe } from './pipes/time.pipe';
import { ProfileImageComponent } from './components/general/profile-image/profile-image.component';
import { MoodComponent } from './components/general/mood/mood.component';
import { AlertsComponent } from './components/pages/alerts/alerts.component';
import { SettingsComponent } from './components/pages/settings/settings.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { EditProfileComponent } from './components/pages/edit-profile/edit-profile.component';
import { PostComponent } from './components/fragments/post/post.component';

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent, canActivate: [isLoggedOutGuard]},
  {path: 'signup', component: LoginComponent, canActivate: [isLoggedOutGuard]},
  {path: 'messages', component: MessagesComponent, canActivate: [isLoggedInGuard]},
  {path: 'home', component: HomeComponent, canActivate: [isLoggedInGuard]},
  {path: 'alerts', component: AlertsComponent, canActivate: [isLoggedInGuard]},
  {path: 'settings', component: SettingsComponent, canActivate: [isLoggedInGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [isLoggedInGuard]},
  {path: 'edit-profile', component: EditProfileComponent, canActivate: [isLoggedInGuard]},
  {path: '', component: HomeComponent, canActivate: [isLoggedInGuard]}
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InputComponent,
    ButtonComponent,
    LogoComponent,
    HomeComponent,
    NavbarComponent,
    NavComponent,
    MessagesComponent,
    SmallProfileComponent,
    LoadingComponent,
    MessageComponent,
    TimePipe,
    ProfileImageComponent,
    MoodComponent,
    AlertsComponent,
    SettingsComponent,
    ProfileComponent,
    EditProfileComponent,
    PostComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},],
  bootstrap: [AppComponent]
})
export class AppModule { }
