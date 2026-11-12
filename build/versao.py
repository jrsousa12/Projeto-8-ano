#!/usr/bin/env python3
"""Recalcula a versão do cache do sw.js a partir do conteúdo dos arquivos do app.
Assim, sempre que algo muda, os celulares com o app instalado baixam a versão nova."""
import hashlib, os, re
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + os.sep
sw = open(A + 'sw.js', encoding='utf-8').read()
lista = re.search(r'ARQ\s*=\s*\[(.*?)\]', sw, re.S).group(1)
arqs = [x[2:] if x.startswith('./') else x for x in re.findall(r'"([^"]+)"', lista)]
h = hashlib.sha1()
for f in sorted(a for a in arqs if a):
    p = A + f
    if os.path.exists(p):
        h.update(f.encode()); h.update(open(p, 'rb').read())
    else:
        print('aviso: arquivo listado no sw.js não existe:', f)
v = 'animais-8ano-' + h.hexdigest()[:8]
novo = re.sub(r'const V = "[^"]*"', 'const V = "%s"' % v, sw, count=1)
if novo != sw:
    open(A + 'sw.js', 'w', encoding='utf-8').write(novo)
print('cache:', v)
