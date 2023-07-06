export function stringEncoder(string) {
    const encodedString = string
        .replace(/ø/g, "_oe")
        .replace(/å/g, "_aa")
        .replace(/æ/g, "_ae")
        .replace(/-/g, "__")
        .replace(/ /g, "-")
        .replace("&#39;", "'")
        .toLowerCase();
    return encodedString;
}

export function stringDecoder(string) {
    let decodedString = string
        .replace(/_oe/g, "ø")
        .replace(/_aa/g, "å")
        .replace(/_ae/g, "æ")
        .split("-")
        .map(s => s.charAt(0).toUpperCase() + s.slice(1).replace(/__/g, "-"))
        .join(" ");

    if (string == "usa") {
        decodedString = "USA";
    }
    return decodedString;
}

export function nationEncoder(string) {
    const encodedString = string
        .toLowerCase()
        .replace("ø", "oe")
        .replace("å", "aa")
        .replace("æ", "ae")
        .replace(" ", "-");

    return encodedString;
}