#!/usr/bin/env python3
"""Gera animais-8ano.html: o app inteiro em um só arquivo (visual, conteúdo e lógica embutidos).
Serve para abrir direto no navegador ou mandar por WhatsApp/pendrive, sem publicar.
Uso: python3 build/arquivo-unico.py"""
import os, re
A = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + os.sep
ler = lambda f: open(A + f, encoding='utf-8').read()
html = ler('index.html')
def embutir_js(m):
    f = m.group(1)
    if not os.path.exists(A + f):
        return ''  # arquivo opcional (ex.: banco-proprio.js ainda não criado)
    js = ler(f)
    assert '</script' not in js.lower(), f + ' contém </script'
    return '<script>\n' + js + '\n</script>'
# no arquivo único não existe o editor (ele fica no site publicado)
html = re.sub(r'\s*<a class="fs" id="ed"[^>]*>.*?</a>', '', html)
html = re.sub(r'<script src="([^"]+)"></script>', embutir_js, html)
html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', lambda m: '<style>\n' + ler(m.group(1)) + '\n</style>', html)
# no arquivo único os scripts ficam dentro da página, então a regra de segurança precisa permiti-los
html = html.replace("script-src 'self'", "script-src 'self' 'unsafe-inline'")
open(A + 'animais-8ano.html', 'w', encoding='utf-8').write(html)
print('animais-8ano.html:', len(html.encode()) // 1024, 'KB')
