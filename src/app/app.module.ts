import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { SettingsComponent } from './settings/settings.component';
import { SearchComponent } from './search/search.component';
import { LearnComponent } from './learn/learn.component';
import { EditWordComponent } from './edit-word/edit-word.component';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './services/user.service';
import { WordService } from './services/word.service';
import { FormsModule } from '@angular/forms';
import { RandomService } from './services/random.service';
import { LoggedUserService } from './services/loggedUser.service';
import { EditedWordService } from './services/editedWord.service';
import { LearnBeginnnerComponent } from './learn/learn-beginnner/learn-beginnner.component';
import { LearnIntermediateComponent } from './learn/learn-intermediate/learn-intermediate.component';
import { LearnAdvancedComponent } from './learn/learn-advanced/learn-advanced.component';
import { TimeService } from './services/time.service';
import { LoginRedirect } from './services/loginRedirect.service';
import { FilterPipe } from './filter.pipe';
import { WordSetService } from './services/word-set.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    SettingsComponent,
    SearchComponent,
    LearnComponent,
    EditWordComponent,
    LearnBeginnnerComponent,
    LearnIntermediateComponent,
    LearnAdvancedComponent,
    FilterPipe,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [
    UserService,
    WordService,
    RandomService,
    LoggedUserService,
    EditedWordService,
    TimeService,
    LoginRedirect,
    WordSetService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
