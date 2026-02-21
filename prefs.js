import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';

import {ExtensionPreferences} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class Prefs extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    const settings = this.getSettings();

    const page = new Adw.PreferencesPage({ title: 'General' });
    window.add(page);

    const group = new Adw.PreferencesGroup({ title: 'Position' });
    page.add(group);

    const row = new Adw.ComboRow({
      title: 'Indicator placement in center box',
      model: new Gtk.StringList({ strings: ['Left edge', 'Right edge'] }),
    });

    row.selected = settings.get_string('position') === 'left-edge' ? 0 : 1;

    row.connect('notify::selected', () => {
      settings.set_string('position', row.selected === 0 ? 'left-edge' : 'right-edge');
    });

    group.add(row);
  }
}
