"""Draw docs/diagrams/db-schema.html from a SQL schema file.

    python docs/diagrams/make_schema.py path/to/schema.sql

Reads every CREATE TABLE: columns, PRIMARY KEY, FOREIGN KEY, UNIQUE and CHECK.
Tables are laid out in columns (a table sits right of the tables it points at), and each
foreign key is a curved line from the FK row to the id it points at.

After the first render, look at db-schema.png. If lines cross boxes, set POSITIONS below
by hand ({"table": (x, y)}) and run again.
"""
import pathlib
import re
import sys

# MedMind layout: the symptom tables across the top, users and appointments under them.
POSITIONS = {"symptoms": (40, 40), "symptomdiseases": (450, 40), "diseases": (860, 40),
             "users": (40, 300), "appointments": (450, 300)}
BOX_WIDTH = 340
ROW = 30
HEAD = 52
GAP_X = 70
GAP_Y = 60
MAX_COLUMN_HEIGHT = 1100

sql = pathlib.Path(sys.argv[1]).read_text(encoding="utf-8")
sql = re.sub(r"--[^\n]*", "", sql)

tables = {}
order = []
for match in re.finditer(r"CREATE TABLE\s+(?:IF NOT EXISTS\s+)?[`\"]?(\w+)[`\"]?\s*\((.*?)\);", sql, re.S | re.I):
    name, body = match.group(1), match.group(2)
    parts = []
    depth = 0
    current = ""
    for ch in body:
        if ch == "(":
            depth += 1
        if ch == ")":
            depth -= 1
        if ch == "," and depth == 0:
            parts.append(current.strip())
            current = ""
        else:
            current += ch
    parts.append(current.strip())

    columns = []
    tags = {}
    fks = []
    notes = []
    for part in parts:
        upper = part.upper()
        fk = re.match(r"FOREIGN KEY\s*\((\w+)\)\s*REFERENCES\s+(\w+)\s*\((\w+)\)", part, re.I)
        if fk:
            fks.append((fk.group(1), fk.group(2), fk.group(3)))
            continue
        if upper.startswith(("UNIQUE", "PRIMARY KEY", "CHECK", "CONSTRAINT")):
            notes.append(re.sub(r"\s+", " ", part))
            continue
        column = part.split()[0].strip('`"')
        columns.append(column)
        t = []
        if "PRIMARY KEY" in upper:
            t.append("PK")
        if "REFERENCES" in upper:
            ref = re.search(r"REFERENCES\s+(\w+)\s*\((\w+)\)", part, re.I)
            fks.append((column, ref.group(1), ref.group(2)))
        if " UNIQUE" in upper:
            t.append("UNIQUE")
        if "CHECK" in upper:
            t.append("CHECK")
        tags[column] = t
    for column, ref_table, ref_column in fks:
        tags.setdefault(column, [])
        tags[column].insert(0, "FK")
    tables[name] = {"columns": columns, "tags": tags, "fks": fks, "notes": notes}
    order.append(name)

# A table's column number: one more than the tables it points at.
level = {}
def find_level(name, seen):
    if name in level:
        return level[name]
    if name in seen or name not in tables:
        return 0
    seen.add(name)
    best = 0
    for column, ref_table, ref_column in tables[name]["fks"]:
        if ref_table != name:
            best = max(best, find_level(ref_table, seen) + 1)
    level[name] = best
    return best
for name in order:
    find_level(name, set())

def box_height(name):
    shown = [c for c in tables[name]["columns"] if c not in ("created_at", "updated_at")]
    return HEAD + ROW * (len(shown) + 1)

# Stack tables in their column; start a new column when one gets too tall.
positions = {}
x = 40
for lvl in sorted(set(level.values())):
    y = 40
    for name in order:
        if level[name] != lvl:
            continue
        h = box_height(name)
        if y + h > MAX_COLUMN_HEIGHT and y > 40:
            x += BOX_WIDTH + GAP_X
            y = 40
        positions[name] = (x, y)
        y += h + GAP_Y
    x += BOX_WIDTH + GAP_X
positions.update(POSITIONS)

width = max(px for px, py in positions.values()) + BOX_WIDTH + 40
height = max(positions[n][1] + box_height(n) for n in positions) + 200

def row_y(name, column):
    shown = [c for c in tables[name]["columns"] if c not in ("created_at", "updated_at")]
    index = shown.index(column) if column in shown else 0
    return positions[name][1] + HEAD + ROW * index + ROW // 2

boxes = []
for name in order:
    px, py = positions[name]
    rows = ""
    has_times = False
    for column in tables[name]["columns"]:
        if column in ("created_at", "updated_at"):
            has_times = True
            continue
        t = tables[name]["tags"].get(column, [])
        cls = "pk" if "PK" in t else ("fk" if "FK" in t else "")
        rows += '<div class="col %s"><span>%s</span><em>%s</em></div>' % (cls, column, " · ".join(t))
    footer = " · ".join(n for n in ["created_at", "updated_at"] if n in tables[name]["columns"]) if has_times else ""
    if tables[name]["notes"]:
        footer = tables[name]["notes"][0]
    rows += '<div class="col ts"><span>%s</span></div>' % footer
    boxes.append('<div class="table" style="left:%dpx;top:%dpx;width:%dpx"><div class="head">%s</div>%s</div>' % (px, py, BOX_WIDTH, name, rows))

paths = []
for name in order:
    for column, ref_table, ref_column in tables[name]["fks"]:
        if ref_table not in positions:
            continue
        sx, sy = positions[name][0], row_y(name, column)
        tx, ty = positions[ref_table][0] + BOX_WIDTH, row_y(ref_table, ref_column)
        if tx > sx:  # target is to the right: leave from the right edge
            sx = positions[name][0] + BOX_WIDTH
            tx = positions[ref_table][0]
        bend = max(40, abs(tx - sx) / 2)
        direction = 1 if tx > sx else -1
        paths.append('<path d="M%d,%d C%d,%d %d,%d %d,%d" marker-start="url(#fk)" marker-end="url(#pk)"/>'
                     % (sx, sy, sx + direction * bend, sy, tx - direction * bend, ty, tx, ty))

template = (pathlib.Path(__file__).parent / "db-schema.template.html").read_text(encoding="utf-8")
html = (template.replace("{{WIDTH}}", str(width)).replace("{{HEIGHT}}", str(height))
        .replace("{{PATHS}}", "\n".join(paths)).replace("{{BOXES}}", "\n".join(boxes)))
out = pathlib.Path(__file__).parent / "db-schema.html"
out.write_text(html, encoding="utf-8")
print("wrote", out, "-", len(tables), "tables")
