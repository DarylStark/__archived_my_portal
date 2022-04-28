class KeyBinding {
    // Class that represents a keybinding. Can be used by commands

    constructor(ctrl, shift, alt, key) {
        // Set the keys for this keybinding
        this.ctrl = ctrl;
        this.shift = shift;
        this.alt = alt;
        this.key = key;
    }

    get_string() {
        // Returns a string representation of the object
        let str = "";

        // Add modifiers
        if (this.ctrl) str += "Ctrl+";
        if (this.shift) str += "Shift+";
        if (this.alt) str += "Alt+";

        // Add the key
        str += this.key.toUpperCase();

        // Return the resulting string
        return str;
    }
}

export default KeyBinding;