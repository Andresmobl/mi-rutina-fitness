import { Component } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {

  langs: string [] = [];
  isDark = false;
  username: string = '';

  constructor(private translateService: TranslateService) {
    this.langs = this.translateService.getLangs();
  }

  async ngOnInit() {
    // Cargar configuración guardada
    await this.loadSettings();
  }

  changeLang(event: CustomEvent){
    this.translateService.use(event.detail.value);
    console.log(event.detail.value);
  }

  // Alternar tema oscuro/claro
  async toggleDarkTheme() {
    document.body.classList.toggle('dark', this.isDark);
    await Preferences.set({ key: 'theme', value: this.isDark ? 'dark' : 'light' });
  }

  // Guardar nombre de usuario
  async saveUsername() {
    await Preferences.set({ key: 'username', value: this.username });
  }

  // Cargar preferencias al iniciar
  async loadSettings() {
    
    // Cargar tema
    const themePref = await Preferences.get({ key: 'theme' });
    if (themePref.value === 'dark') {
      this.isDark = true;
      document.body.classList.add('dark');
    } else {
      this.isDark = false;
      document.body.classList.remove('dark');
    }

    // Cargar username
    const usernamePref = await Preferences.get({ key: 'username' });
    if (usernamePref.value) {
      this.username = usernamePref.value;
    }
  }
}