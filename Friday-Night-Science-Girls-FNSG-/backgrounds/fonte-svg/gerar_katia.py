from lib import *
random.seed(33)
CRATERA=(1220,205)
def build():
    c=Cena(outline="#150b2a",ow=7); A=c.add
    sky=c.lg([(0,"#150f3d",1),(.32,"#4a2078",1),(.58,"#b23d7c",1),(.8,"#ff7f4d",1),(1,"#ffc46f",1)])
    A(f'<rect width="1920" height="1080" fill="{sky}"/>')
    # estrelas
    for i in range(110):
        x,y=random.randint(0,1920),random.randint(0,520); r=random.choice((1.6,2,2.4,3))
        A(f'<path d="{blob(x,y,r,r,6,.3)}" fill="#ffe9a8" opacity="{random.uniform(.35,.95):.2f}"/>')
    for i in range(12):
        x,y=random.randint(40,1880),random.randint(30,420); r=random.randint(7,13)
        A(f'<path d="M{x},{y-r} Q{x+2},{y-2} {x+r},{y} Q{x+2},{y+2} {x},{y+r} Q{x-2},{y+2} {x-r},{y} Q{x-2},{y-2} {x},{y-r}Z" fill="#fff4c4" opacity=".85"/>')
    # lua
    c.glow(330,210,230,"#ffd6a0",.35)
    c.path(blob(330,210,70,70,12,.04),"#ffe9a8",w=5)
    for (dx,dy,r) in ((-20,-14,14),(22,10,10),(-6,28,8)): A(f'<path d="{blob(330+dx,210+dy,r,r*.8,8,.12)}" fill="#e8c27a" opacity=".6"/>')
    # brilho geral do vulcão
    c.glow(1220,300,900,"#ff6a2a",.38)
    # ---------------- cordilheira ao fundo
    pts=[(x,720-random.uniform(40,150)+40*math.sin(x/190)) for x in range(-100,2100,120)]
    c.path(smooth_open(pts)+" L2100,900 L-100,900Z","#4a2a66",w=5,stroke="#2a1648",extra='opacity=".95"')
    # ---------------- VULCÃO
    A('<g filter="url(#mao)">')
    corpo=[(230,820),(520,770),(760,650),(930,520),(1040,400),(1105,300),(1128,232),(1150,214),(1190,222),(1235,208),(1285,222),(1312,210),(1332,236),(1360,300),(1420,410),(1540,540),(1700,670),(1950,780),(2050,830)]
    d=smooth_open(corpo)+" L2050,900 L230,900Z"
    c.path(d,c.lg([(0,"#51306e",1),(.55,"#3a2154",1),(1,"#2b1642",1)],0,0,1,.3),w=9)
    cl=c.clip(d); A(f'<g clip-path="url(#{cl})">')
    # lado em sombra (direita)
    A(f'<path d="M1235,208 C1290,330 1380,470 1480,560 C1640,700 1800,760 2060,820 L2060,900 L1300,900 C1290,640 1260,420 1235,208Z" fill="#1d0f33" opacity=".7"/>')
    # sulcos / vales
    for k in range(9):
        t=k/8; x0=1130+t*180; x1=300+t*1500+random.uniform(-80,80)
        A(f'<path d="{smooth_open([(x0,230),((x0*2+x1)/3+random.uniform(-30,30),420),((x0+x1*2)/3+random.uniform(-60,60),620),(x1,820)])}" stroke="#1a0c2e" stroke-width="{random.randint(6,12)}" fill="none" opacity=".55"/>')
    # luz de lava nas bordas
    A(f'<path d="{smooth_open([(1130,232),(1100,320),(1040,420),(940,540)])}" stroke="#ff8a3a" stroke-width="10" fill="none" opacity=".7"/>')
    A(f'<path d="{smooth_open([(1312,214),(1345,300),(1415,410)])}" stroke="#ff8a3a" stroke-width="8" fill="none" opacity=".45"/>')
    # névoa de distância na base
    A(f'<rect x="0" y="560" width="1920" height="300" fill="{c.lg([(0,"#ff7a4a",0),(1,"#ff7a4a",.55)])}"/>')
    A('</g>')
    # rios de lava
    rios=[[(1150,226),(1122,300),(1112,380),(1082,470),(1040,560),(1010,640)],[(1222,228),(1232,320),(1218,420),(1238,520),(1226,620)],[(1296,228),(1322,300),(1336,390),(1372,470),(1420,560),(1470,640)],[(1190,232),(1176,270),(1180,340),(1164,400)]]
    for r in rios:
        dd=smooth_open(r)
        A(f'<path d="{dd}" stroke="#ff5a14" stroke-width="40" fill="none" opacity=".5" filter="url(#blur20)"/>')
        A(f'<path d="{dd}" stroke="#2a0d1c" stroke-width="22" fill="none" stroke-linecap="round"/>')
        A(f'<path d="{dd}" stroke="#ff6a1f" stroke-width="13" fill="none" stroke-linecap="round"/>')
        A(f'<path d="{dd}" stroke="#ffd35a" stroke-width="5" fill="none" stroke-linecap="round" opacity=".95"/>')
    # cratera
    c.path(blob(1222,214,112,26,14,.07),"#ff7a22",w=8)
    A(f'<path d="{blob(1222,214,78,15,12,.08)}" fill="#ffd35a"/>')
    for (dx,r) in ((-100,26),(-60,22),(70,24),(104,28)): c.path(blob(1222+dx,206,r,r*.7,8,.2),"#2d1744",w=6)
    A('</g>')
    c.glow(1222,214,330,"#ffb347",.6)
    # ---------------- coluna de fumaça (peça única por união de manchas orgânicas)
    blobs=[(1210,110,95,80),(1160,20,120,95),(1290,10,130,100),(1230,-80,150,110),(1110,-30,100,80),(1360,70,90,70),(1060,70,70,55),(1190,170,70,50)]
    A('<g filter="url(#mao2)">')
    ds=[blob(x,y,rx,ry,12,.18) for x,y,rx,ry in blobs]
    for d in ds: A(f'<path d="{d}" fill="none" stroke="#150b2a" stroke-width="16"/>')
    for d in ds: A(f'<path d="{d}" fill="#4a3469"/>')
    A('</g>')
    A(f'<ellipse cx="1220" cy="150" rx="330" ry="250" fill="{c.rg([(0,"#ff8a3a",.7),(.5,"#c4457a",.25),(1,"#4a3469",0)])}"/>')
    # ---------------- skyline distante
    def torre(x,base,w,h,lean,fill,out,wins,seed):
        random.seed(seed)
        top=[(x+lean,base-h),(x+w+lean+random.uniform(-6,6),base-h+random.uniform(-10,10))]
        if random.random()<.5:   # degrau no topo
            top=[(x+lean,base-h+30),(x+lean+w*.35,base-h+26),(x+lean+w*.35,base-h),(x+w+lean,base-h+random.uniform(-8,8))]
        pts=top+[(x+w+random.uniform(-3,3),base),(x,base)]
        d=poly_d(jitter_poly(pts,3)); c.path(d,fill,w=5,stroke=out)
        if random.random()<.45: A(f'<path d="{wavy_line(x+lean+w*.5,base-h,x+lean+w*.5+3,base-h-random.randint(30,90),2,2)}" stroke="{out}" stroke-width="6" fill="none"/>')
        for r in range(int(h/60)):
            for k in range(int(w/38)):
                if random.random()<wins:
                    wx=x+lean*(1-(r*60)/h)+12+k*38; wy=base-h+36+r*60
                    col=random.choice(("#38b6ff","#38b6ff","#ffd166","#ff9f5a"))
                    A(f'<rect x="{wx:.0f}" y="{wy:.0f}" width="{random.randint(14,22)}" height="{random.randint(22,34)}" rx="4" fill="{col}" transform="rotate({random.uniform(-6,6):.1f} {wx:.0f} {wy:.0f})"/>')
    A('<g filter="url(#mao2)" opacity=".95">')
    x=-40; s=100
    while x<1960:
        w=random.randint(90,150); h=random.randint(80,190); torre(x,820,w,h,random.randint(-22,22),"#35205c","#1c0f3a",.2,s); x+=w+random.randint(-10,26); s+=1
    A('</g>')
    A(f'<rect x="0" y="560" width="1920" height="280" fill="{c.lg([(0,"#ff6a2a",0),(1,"#ff6a2a",.28)])}"/>')
    A('<g filter="url(#mao2)">')
    x=-60; s=300
    while x<1960:
        w=random.randint(120,210); h=random.randint(100,250); torre(x,832,w,h,random.randint(-30,30),"#1d1038","#0e0820",.32,s); x+=w+random.randint(-10,30); s+=1
    A('</g>')
    # ---------------- rua / concreto
    A('<g filter="url(#mao)">')
    c.path("M-40,820 L1960,820 L1960,1100 L-40,1100Z",c.lg([(0,"#3a3a78",1),(.4,"#2a2860",1),(1,"#1b1a42",1)]),w=7)
    c.path("M-40,820 L1960,820 L1960,872 L-40,872Z","#4e4e96",w=6)
    for i in range(18):   # rachaduras
        x=random.randint(0,1900); y=random.randint(900,1060)
        A(f'<path d="{smooth_open([(x,y),(x+random.randint(30,70),y+random.randint(-14,14)),(x+random.randint(80,140),y+random.randint(-20,20)),(x+random.randint(150,220),y+random.randint(-16,16))])}" stroke="#12102e" stroke-width="4" fill="none" opacity=".8"/>')
    for i in range(7):
        x=100+i*290; A(f'<path d="{blob(x,990+random.randint(-10,20),90,9,10,.2)}" fill="#ffd166" opacity=".55"/>')
    A('</g>')
    A(f'<ellipse cx="1220" cy="960" rx="620" ry="140" fill="{c.rg([(0,"#ff7a3a",.5),(1,"#ff7a3a",0)])}"/>')
    # poças com reflexo
    for (x,y,rx) in ((520,980,150),(1480,1010,190)):
        A(f'<path d="{blob(x,y,rx,26,12,.12)}" fill="{c.lg([(0,"#ffb347",.85),(1,"#6a4a9a",.7)])}" stroke="#150b2a" stroke-width="5"/>')
    # ---------------- postes de energia inclinados + fios (como nos mods)
    A('<g filter="url(#mao2)">')
    def poste(x,lean):
        d=f"M{x-26},900 C{x-26+lean*.2},700 {x-30+lean*.7},400 {x-20+lean},110 L{x+34+lean},96 C{x+36+lean*.7},400 {x+34+lean*.2},700 {x+40},900Z"
        c.path(d,c.lg([(0,"#7c2c46",1),(1,"#4a1a30",1)],0,0,1,0),w=9,stroke="#2a0c1e")
        c.path(f"M{x-110+lean},150 L{x+150+lean},130 L{x+154+lean},170 L{x-106+lean},190Z","#5a2038",w=7,stroke="#2a0c1e")
        for dx in (-90,-10,70,130): c.path(blob(x+dx+lean,128,10,13,7,.1),"#3a8a9a",w=4,stroke="#2a0c1e")
    poste(150,120); poste(1770,-120)
    for k,(y0,sag) in enumerate(((140,60),(160,70),(176,80))):
        A(f'<path d="M{-40},{y0+10} C300,{y0+sag} 520,{y0+sag*1.4} 900,{y0+sag*.9} S1500,{y0+sag*1.2} 1960,{y0-10}" stroke="#1a0c2a" stroke-width="5" fill="none"/>')
    A('</g>')
    # luz geral: vinheta de cinzas
    A(f'<rect width="1920" height="1080" fill="{c.lg([(0,"#0c0620",.55),(.3,"#0c0620",0),(1,"#0c0620",.35)])}"/>')
    return c.svg()
open("katia.svg","w",encoding="utf8").write(build())
