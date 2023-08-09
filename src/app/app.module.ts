import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/pages/login/login.component';
import { InputComponent } from './components/general/input/input.component';
import { ButtonComponent } from './components/general/button/button.component';
import { LogoComponent } from './components/general/logo/logo.component';
import { FormsModule } from '@angular/forms';
import { GoogleLoginProvider } from 'angularx-social-login';
import { HttpClientModule } from '@angular/common/http'
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { NavbarComponent } from './components/fragments/navbar/navbar.component';
import { NavComponent } from './components/general/nav/nav.component';
import { MessagesComponent } from './components/pages/messages/messages.component';
import { SmallProfileComponent } from './components/general/small-profile/small-profile.component';

const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: LoginComponent},
  {path: 'messages', component: MessagesComponent},
  {path: '', component: HomeComponent}
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
    SmallProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [{
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider('')
        }
      ]
    }
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
