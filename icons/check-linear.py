"""Check a Parks editable Linear master against the initial path-only profile."""
import sys
from pathlib import Path
from xml.etree import ElementTree as ET

SVG = "{http://www.w3.org/2000/svg}"
MASTER = {
    "width": "24", "height": "24", "viewBox": "0 0 24 24",
    "fill": "none", "stroke": "currentColor", "stroke-width": "1.5",
    "stroke-linecap": "round", "stroke-linejoin": "round",
}


def check(path):
    root = ET.parse(path).getroot()
    if root.tag != SVG + "svg":
        yield "expected an SVG document"
    for key, value in MASTER.items():
        if root.get(key) != value:
            yield f"expected {key}={value!r} on the root"
    for key in root.attrib.keys() - MASTER.keys():
        yield f"unexpected root attribute {key}"
    if not len(root):
        yield "expected at least one editable path"
    for index, node in enumerate(root, 1):
        if (node.tag != SVG + "path" or node.attrib.keys() != {"d"}
                or not node.get("d", "").strip() or len(node)):
            yield f"child {index} must be a path with only nonempty d data"


if __name__ == "__main__":
    if not sys.argv[1:]:
        sys.exit("usage: python3 icons/check-linear.py FILE.svg [FILE.svg ...]")
    failed = False
    for filename in sys.argv[1:]:
        try:
            problems = list(check(Path(filename)))
        except (ET.ParseError, OSError) as error:
            problems = [str(error)]
        for problem in problems:
            print(f"{filename}: {problem}", file=sys.stderr)
        failed |= bool(problems)
    sys.exit(int(failed))
