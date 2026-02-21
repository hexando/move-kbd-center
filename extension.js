import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

export default class MoveKbdCenterExtension extends Extension {
  enable() {
    this._settings = this.getSettings();
    this._changedId = this._settings.connect('changed::position', () => this._reposition());

    const keyboardIndicator = Main.panel.statusArea?.keyboard;
    this._actor = keyboardIndicator?.container ?? keyboardIndicator?.actor;

    if (!this._actor)
      return;

    this._origParent = this._actor.get_parent();
    this._origIndex = this._origParent
      ? this._origParent.get_children().indexOf(this._actor)
      : -1;

    this._reposition();
  }

  _reposition() {
    if (!this._actor)
      return;

    const centerBox = Main.panel._centerBox;
    const position = this._settings.get_string('position');

    const parent = this._actor.get_parent();
    if (parent)
      parent.remove_child(this._actor);

    const children = centerBox.get_children();

    if (position === 'left-edge') {
      centerBox.insert_child_at_index(this._actor, 0);
    } else {
      centerBox.add_child(this._actor);
    }
  }

  disable() {
    if (this._changedId && this._settings) {
      this._settings.disconnect(this._changedId);
      this._changedId = 0;
    }

    if (!this._actor)
      return;

    const curParent = this._actor.get_parent();
    if (curParent)
      curParent.remove_child(this._actor);

    if (this._origParent) {
      const idx = this._origIndex >= 0 ? this._origIndex : 0;
      this._origParent.insert_child_at_index(this._actor, idx);
    }

    this._actor = null;
    this._origParent = null;
    this._origIndex = -1;
    this._settings = null;
  }
}
