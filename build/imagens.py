#!/usr/bin/env python3
"""Motor das ilustrações (img/animais/*.webp). Mostra só um resumo curto.

Uso (na pasta do projeto):
  python3 build/imagens.py listar
      Onde há ilustração e onde falta. Relatório em revisao/imagens.md. Só avisa, nunca altera.
      Erro (sai com 1): o app aponta para uma imagem que não existe.
  python3 build/imagens.py adicionar <arquivo> <nome> [--pa chave | --emj nome] [--substituir]
      Converte a imagem (PNG, JPG ou WebP, por exemplo feita no Canva) para WebP, reduz até
      LIMITE_KB, grava em img/animais/<nome>.webp e liga ao app:
        g-<grupo>  ícone do grupo        p-<grupo>  ilustração grande do grupo
        a-<nome>   animal: --pa <chave> (fauna do Pará, PAIMG do conteudo.js)
                           --emj <nome> (jogo "Quem é este?", EMJIMG do jogos.js)
      A lista IMGS do sw.js e o arquivo único são atualizados pelo bash build/tudo.sh.
A variável IMAGENS_RAIZ troca a pasta do projeto (usada pelo teste build/t_imagens.py)."""
import io, json, os, re, subprocess, sys

RAIZ = os.environ.get("IMAGENS_RAIZ") or os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PASTA = os.path.join(RAIZ, "img", "animais")
LIMITE_KB = 40       # tamanho máximo de uma ilustração nova
AVISO_KB = 60        # ilustração já existente acima disto entra como aviso
TAM = {"a": (420, 420), "g": (360, 360), "p": (534, 720)}  # maior largura e altura (como as atuais)
MAPAS = {"pa": ("conteudo.js", "PAIMG"), "emj": ("jogos.js", "EMJIMG")}

NODE = r"""
const fs=require('fs'),vm=require('vm'),c={window:{},document:{},console};vm.createContext(c);
vm.runInContext(fs.readFileSync(process.argv[1],'utf8').replace(/^const /gm,'var '),c);
let np=c.G.length;const conta=x=>{if(!Array.isArray(x)){if(x&&typeof x==='object')Object.values(x).forEach(conta);return;}
 if(typeof x[0]==='string'&&Array.isArray(x[1])&&x[1].every(s=>typeof s==='string')){np++;return;}x.forEach(conta);};
['EXTRA','EXTRA2','BANK3','BANK4','QZ','MQ0','MQX'].forEach(k=>conta(c[k]));
console.log(JSON.stringify({G:c.G.map(g=>g.id),EMJ:c.EMJ.map(x=>x[0]),AN:c.AN.map(x=>x[0]),perguntas:np}));"""


def ler(arq): return open(os.path.join(RAIZ, arq), encoding="utf-8").read()


def dados():
    s = subprocess.run(["node", "-e", NODE, os.path.join(RAIZ, "dados.js")], capture_output=True, text=True)
    if s.returncode: sys.exit("Erro ao ler o dados.js: " + s.stderr.strip()[-300:])
    return json.loads(s.stdout)


def mapa(tipo):
    arq, nome = MAPAS[tipo]
    m = re.search(r"const " + nome + r"=(\{.*?\});", ler(arq))
    return json.loads(m.group(1))


def pak(): return json.loads(re.search(r"const PAK=(\[.*?\]);", ler("conteudo.js")).group(1))


def gravar_mapa(tipo, chave, img):
    arq, nome = MAPAS[tipo]
    m = mapa(tipo); m[chave] = img
    s = re.sub(r"const " + nome + r"=\{.*?\};", lambda _: "const " + nome + "=" + json.dumps(m, ensure_ascii=False, separators=(",", ":")) + ";", ler(arq), count=1)
    open(os.path.join(RAIZ, arq), "w", encoding="utf-8").write(s)


def existentes(): return {f[:-5]: os.path.getsize(os.path.join(PASTA, f)) for f in os.listdir(PASTA) if f.endswith(".webp")}


def listar():
    d, imgs, pa, emj = dados(), existentes(), mapa("pa"), mapa("emj")
    usadas, erros, avisos, md = set(), [], [], ["# Ilustrações do app", "", "Gerado por `python3 build/imagens.py listar`. Só avisa, nunca altera.", ""]
    def usa(img, onde):
        usadas.add(img)
        if img not in imgs: erros.append(f"{onde}: falta img/animais/{img}.webp")
    for g in d["G"]: usa("g-" + g, "ícone do grupo " + g); usa("p-" + g, "ilustração do grupo " + g)
    sem_pa = [k for k in pak() if k not in pa]
    for k, v in pa.items(): usa(v, "fauna do Pará " + k)
    sem_emj = [n for n in d["EMJ"] if n not in emj]
    for k, v in emj.items(): usa(v, "Quem é este? " + k)
    sobra = sorted(set(imgs) - usadas)
    grandes = sorted(f"{k} ({v // 1024} KB)" for k, v in imgs.items() if v > AVISO_KB * 1024)
    total = sum(imgs.values()) // 1024
    linhas = [
        ("Grupos (ícone e ilustração)", f"{len(d['G'])} grupos, {sum(('g-' + g in imgs) + ('p-' + g in imgs) for g in d['G'])} de {2 * len(d['G'])} imagens"),
        ("Fauna do Pará", f"{len(pa)} de {len(pak())} com ilustração; sem: {', '.join(sem_pa) or 'nenhum'} (usam desenho do arte.js)"),
        ("Jogo Quem é este?", f"{len(emj)} de {len(d['EMJ'])} com ilustração; sem: {', '.join(sem_emj) or 'nenhum'}"),
        ("Jogo de classificar", f"{len(d['AN'])} animais, só com o nome (sem imagem)"),
        ("Perguntas", f"{d['perguntas']} perguntas, nenhuma com figura (parte 3 do plano)"),
        ("Arquivos", f"{len(imgs)} ilustrações, {total} KB; sem uso: {', '.join(sobra) or 'nenhuma'}; acima de {AVISO_KB} KB: {', '.join(grandes) or 'nenhuma'}"),
    ]
    md += [f"- **{a}:** {b}" for a, b in linhas]
    md += ["", "## Erros", ""] + ([f"- {e}" for e in erros] or ["- nenhum"])
    os.makedirs(os.path.join(RAIZ, "revisao"), exist_ok=True)
    open(os.path.join(RAIZ, "revisao", "imagens.md"), "w", encoding="utf-8").write("\n".join(md) + "\n")
    avisos = len(sem_pa) + len(sem_emj) + len(sobra) + len(grandes)
    print(f"{len(imgs)} ilustrações ({total} KB): {len(erros)} erro(s), {avisos} aviso(s). Relatório: revisao/imagens.md")
    for e in erros[:10]: print("  ✘ " + e)
    return 1 if erros else 0


def converter(arq, tipo):
    from PIL import Image
    im = Image.open(arq)
    im = im.convert("RGBA") if im.mode in ("RGBA", "LA", "P") else im.convert("RGB")
    im.thumbnail(TAM[tipo], Image.LANCZOS)
    for q in range(85, 20, -5):
        b = io.BytesIO(); im.save(b, "WEBP", quality=q, method=6)
        if b.tell() <= LIMITE_KB * 1024: return b.getvalue(), q, im.size
    sys.exit(f"Erro: mesmo com qualidade baixa a imagem passa de {LIMITE_KB} KB. Use uma imagem mais simples.")


def adicionar(args):
    subst = "--substituir" in args; args = [a for a in args if a != "--substituir"]
    liga = None
    for op in ("--pa", "--emj"):
        if op in args:
            i = args.index(op)
            if i + 1 >= len(args): sys.exit(f"Erro: falta a chave depois de {op}.")
            liga = (op[2:], args[i + 1]); del args[i:i + 2]
    if len(args) != 2: sys.exit(__doc__)
    arq, nome = args
    if not os.path.isfile(arq): sys.exit(f"Erro: arquivo não encontrado: {arq}")
    if not re.fullmatch(r"[agp]-[a-z0-9]+(-[a-z0-9]+)*", nome): sys.exit("Erro: nome deve ser g-, p- ou a- + letras minúsculas sem acento, números e hífen (ex.: a-peixe-boi).")
    tipo, d = nome[0], dados()
    if tipo in "gp" and nome[2:] not in d["G"]: sys.exit(f"Erro: grupo desconhecido '{nome[2:]}'. Grupos: {', '.join(d['G'])}")
    if tipo in "gp" and liga: sys.exit("Erro: --pa e --emj servem só para a- (animais).")
    if liga and liga[0] == "pa" and liga[1] not in pak(): sys.exit(f"Erro: chave '{liga[1]}' não está na fauna do Pará. Chaves: {', '.join(pak())}")
    if liga and liga[0] == "emj" and liga[1] not in d["EMJ"]: sys.exit(f"Erro: '{liga[1]}' não está no jogo Quem é este? (EMJ do dados.js).")
    destino = os.path.join(PASTA, nome + ".webp")
    if os.path.exists(destino) and not subst: sys.exit(f"Erro: {nome}.webp já existe. Para trocar, acrescente --substituir.")
    dados_img, q, tam = converter(arq, tipo)
    open(destino, "wb").write(dados_img)
    if liga: gravar_mapa(liga[0], liga[1], nome)
    onde = {"g": "ícone do grupo", "p": "ilustração do grupo"}.get(tipo) or ({"pa": "fauna do Pará", "emj": "Quem é este?"}[liga[0]] + " → " + liga[1] if liga else "sem ligação (aparece como sem uso)")
    print(f"✔ img/animais/{nome}.webp ({len(dados_img) // 1024} KB, {tam[0]}×{tam[1]}, qualidade {q}): {onde}. Depois: bash build/tudo.sh")
    return 0


if __name__ == "__main__":
    a = sys.argv[1:]
    if a[:1] == ["listar"]: sys.exit(listar())
    if a[:1] == ["adicionar"]: sys.exit(adicionar(a[1:]))
    sys.exit(__doc__)
