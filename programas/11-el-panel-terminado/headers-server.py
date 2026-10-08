# headers-server.py
# Sirve una carpeta como lo hace `python3 -m http.server`, pero además envía los
# encabezados que declara el archivo _headers de esa carpeta. Así pruebas en tu
# computadora lo mismo que va a enviar el servidor donde publiques. Y, como el
# slow-server.py de la lección 9, entiende ?delay=MILISEGUNDOS para tardar a propósito.
#
# Uso:  python3 headers-server.py [carpeta] [puerto]
import fnmatch
import sys
import time
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

# Nadie necesita esperar más de diez segundos para ver el efecto.
MAX_DELAY_MS = 10000


def read_rules(folder):
    """Devuelve una lista de (patrón de ruta, encabezado, valor)."""
    rules = []
    pattern = None
    headers_file = Path(folder) / "_headers"
    if not headers_file.exists():
        return rules
    for line in headers_file.read_text(encoding="utf-8").splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if not line[0].isspace():
            pattern = line.strip()  # una ruta: "/*" o "/index.html"
            continue
        name, _, value = line.strip().partition(":")
        rules.append((pattern, name.strip(), value.strip()))
    return rules


class Handler(SimpleHTTPRequestHandler):
    rules = []

    def do_GET(self):
        # Lo mismo que slow-server.py: ?delay=3000 espera tres segundos antes de contestar.
        query = parse_qs(urlsplit(self.path).query)
        delay = query.get("delay", ["0"])[0]
        if delay.isdigit():
            time.sleep(min(int(delay), MAX_DELAY_MS) / 1000)
        try:
            super().do_GET()
        except (BrokenPipeError, ConnectionResetError):
            # El navegador se cansó de esperar y cerró la conexión.
            pass

    def end_headers(self):
        path = self.path.split("?", 1)[0]
        for pattern, name, value in self.rules:
            if fnmatch.fnmatch(path, pattern):
                self.send_header(name, value)
        super().end_headers()


def main():
    folder = sys.argv[1] if len(sys.argv) > 1 else "."
    port = int(sys.argv[2]) if len(sys.argv) > 2 else 8000
    Handler.rules = read_rules(folder)
    print(f"{len(Handler.rules)} encabezados leídos de {folder}/_headers", flush=True)
    server = ThreadingHTTPServer(
        ("127.0.0.1", port), partial(Handler, directory=folder)
    )
    print(f"Sirviendo {folder} en http://127.0.0.1:{port}  (Ctrl+C para parar)", flush=True)
    server.serve_forever()


main()
