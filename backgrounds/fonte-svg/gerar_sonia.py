from lib import *
random.seed(21)
def build():
    c=Cena(outline="#1d2a44",ow=7)
    A=c.add
    # ---------------- céu
    sky=c.lg([(0,"#2f9bf0",1),(.45,"#78cdfb",1),(.8,"#d9f2ff",1),(1,"#fff2d2",1)])
    A(f'<rect width="1920" height="1080" fill="{sky}"/>')
    c.glow(1560,170,520,"#fff2a8",.75)
    for i in range(9):   # raios de luz
        a=math.radians(100+i*9)
        A(f'<polygon points="1560,170 {1560+math.cos(a)*1700:.0f},{170+math.sin(a)*1700:.0f} {1560+math.cos(a+.05)*1700:.0f},{170+math.sin(a+.05)*1700:.0f}" fill="#fff" opacity=".07"/>')
    c.path(blob(1560,170,74,72,12,.05),"#ffe66d",w=6)
    c.nostroke(blob(1545,155,40,38,10,.1),"#fff7bd",'opacity=".8"')
    # nuvens estáticas (as animadas passam por cima)
    for (x,y,w,h) in ((260,230,300,120),(820,120,240,90),(1180,320,260,90)):
        d=cloud(x,y,w,h); c.path(d,"#ffffff",w=6); c.nostroke(d,c.lg([(.5,"#fff",0),(1,"#bcd8f5",.9)]))
    # ---------------- colinas distantes
    for (y0,col,op) in ((650,"#9fd9c9",.9),(700,"#6cc3a2",1)):
        pts=[(x,y0-random.uniform(30,90)+60*math.sin(x/260+y0)) for x in range(-100,2100,150)]
        d=smooth_open(pts)+f" L2100,900 L-100,900Z"
        c.path(d,col,w=5,stroke="#3b6f78",extra=f'opacity="{op}"')
    # ---------------- ITA
    G=[]  # grupo desenhado com leve tremor de lápis
    def concreto(x,y,w,h,dark=False):
        base="#efe6d2" if not dark else "#e2d7bf"
        pts=jitter_poly([(x,y),(x+w,y+random.uniform(-3,3)),(x+w+random.uniform(-3,3),y+h),(x,y+h)],3)
        d=poly_d(pts); c.path(d,base,w=7)
        sh=c.lg([(0,"#000",0),(.6,"#7a5f3a",.0),(1,"#7a5f3a",.35)],0,0,1,0); c.nostroke(d,sh)
        return d
    def vidro(x,y,w,h):
        pts=jitter_poly([(x,y),(x+w,y),(x+w,y+h),(x,y+h)],2); d=poly_d(pts)
        g=c.lg([(0,"#9be0ff",1),(.55,"#4aa5e0",1),(1,"#2b6fb8",1)]); c.path(d,g,w=5)
        cl=c.clip(d)
        A(f'<g clip-path="url(#{cl})">')
        for k in range(int(w/110)+1):
            xx=x+k*110+random.uniform(-10,10); A(f'<polygon points="{xx:.0f},{y} {xx+46:.0f},{y} {xx-20:.0f},{y+h} {xx-66:.0f},{y+h}" fill="#fff" opacity=".28"/>')
        A('</g>')
        for k in range(1,int(w/46)):
            xx=x+k*46+random.uniform(-2,2); A(f'<path d="{wavy_line(xx,y+2,xx+random.uniform(-2,2),y+h-2,1.2,2)}" stroke="#1d2a44" stroke-width="3.5" fill="none" opacity=".75"/>')
    A('<g filter="url(#mao)">')
    # alas
    for (x0,x1) in ((190,830),(1090,1730)):
        w=x1-x0
        concreto(x0-16,444,w+32,34)                       # laje da cobertura
        concreto(x0,478,w,250)                             # miolo
        vidro(x0+24,516,w-48,74); vidro(x0+24,622,w-48,74)
        concreto(x0-16,722,w+32,34,True)                   # laje inferior
        # pilotis e sombra
        pts=jitter_poly([(x0,756),(x1,756),(x1,800),(x0,800)],2); c.path(poly_d(pts),"#2a2f4b",w=6)
        for k in range(int(w/110)+1):
            xx=x0+14+k*110; concreto(xx,756,28,44,False)
    # torre
    concreto(790,300,340,430)
    concreto(764,272,392,40)
    # brise-soleil (aletas verticais) na torre
    for k in range(9):
        xx=812+k*34+random.uniform(-2,2)
        pts=jitter_poly([(xx,480),(xx+16,480),(xx+20,722),(xx+2,722)],2); c.path(poly_d(pts),"#f6eee0",w=4)
    vidro(804,486,312,236)
    for k in range(9):
        xx=812+k*34; pts=jitter_poly([(xx,480),(xx+16,480),(xx+20,722),(xx+2,722)],1.5); c.path(poly_d(pts),"#f6eee0",w=4)
    # placa
    d=poly_d(jitter_poly([(832,338),(1088,334),(1092,450),(828,454)],4)); c.path(d,c.lg([(0,"#2c6cd0",1),(1,"#1b3f94",1)]),w=8)
    A('<text x="960" y="432" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-size="108" fill="#fff" stroke="#10204a" stroke-width="10" paint-order="stroke" transform="rotate(-1.2 960 420)">ITA</text>')
    # marquise e porta
    concreto(840,724,240,22)
    pts=jitter_poly([(884,746),(1036,746),(1036,800),(884,800)],2); c.path(poly_d(pts),c.lg([(0,"#8fd8ff",1),(1,"#3b86c4",1)]),w=6)
    # antena
    A(f'<path d="{wavy_line(960,272,962,160,2,3)}" stroke="#1d2a44" stroke-width="9" fill="none"/>'); c.path(blob(962,152,12,12,7,.1),"#ff5a5a",w=5)
    A('</g>')
    # ---------------- bandeiras (ondulando)
    A('<g filter="url(#mao2)">')
    for fx in (650,1270):
        A(f'<path d="{wavy_line(fx,470,fx,800,3,4)}" stroke="#1d2a44" stroke-width="10" fill="none"/>')
        d=f"M{fx},476 C{fx+40},458 {fx+80},500 {fx+130},482 L{fx+136},566 C{fx+86},586 {fx+44},544 {fx},562Z"
        c.path(d,"#2cb34f",w=6)
        c.path(f"M{fx+66},482 L{fx+112},523 L{fx+66},562 L{fx+20},523Z","#ffd83b",w=4)
        c.path(blob(fx+66,523,19,19,8,.06),"#2557c8",w=3)
    A('</g>')
    # ---------------- chão da praça
    gr=c.lg([(0,"#d9d2c4",1),(.5,"#c7bfb0",1),(1,"#a89f93",1)])
    A('<g filter="url(#mao)">')
    c.path("M-40,792 L1960,792 L1960,1100 L-40,1100Z",gr,w=7)
    for i in range(-3,15):   # junções do piso em perspectiva
        x0=960+(i-5.5)*60; x1=960+(i-5.5)*340
        A(f'<path d="{wavy_line(x0,800,x1,1100,4,5)}" stroke="#8d8579" stroke-width="4" fill="none" opacity=".7"/>')
    for y in (850,930,1030): A(f'<path d="{wavy_line(-20,y,1940,y+random.uniform(-6,6),4,9)}" stroke="#8d8579" stroke-width="4" fill="none" opacity=".7"/>')
    A('</g>')
    c.nostroke("M-40,792 L1960,792 L1960,830 L-40,830Z",c.lg([(0,"#000",.25),(1,"#000",0)]))
    # ---------------- árvores
    def arvore(x,y,s=1,dark=False):
        cl1,cl2,cl3=("#3fae5a","#2d8c47","#7bd77a") if not dark else ("#2f8f4c","#1f6d3a","#55b86a")
        A(f'<g transform="translate({x},{y}) scale({s})">')
        A('<ellipse cx="10" cy="14" rx="150" ry="22" fill="#000" opacity=".22" filter="url(#blur8)"/>')
        c.path("M-16,16 C-12,-40 -22,-80 -10,-130 L26,-130 C14,-80 24,-40 24,16Z","#7a4a2e",w=7)
        d=folhagem(0,-190,300,230); c.path(d,cl2,w=7)
        cl=c.clip(d)
        A(f'<g clip-path="url(#{cl})"><path d="{blob(-30,-230,150,110,9,.14)}" fill="{cl1}"/><path d="{blob(-50,-250,70,48,8,.15)}" fill="{cl3}" opacity=".9"/></g>')
        A('</g>')
    A('<g filter="url(#mao2)">')
    for (x,y,s) in ((120,800,1.0),(560,790,.62),(1350,790,.62),(1800,800,1.0)): arvore(x,y,s)
    A('</g>')
    # canteiros + arbustos na base do prédio
    A('<g filter="url(#mao2)">')
    for x in range(250,1700,170):
        if 780<x<1130: continue
        d=folhagem(x,792,150,66,5); c.path(d,"#2f9a4c",w=6)
    A('</g>')
    # ---------------- monumento: avião em pedestal
    A('<g filter="url(#mao2)" transform="translate(1490,0)">')
    c.path("M10,880 L150,880 L158,930 L2,930Z","#b9b0a1",w=7)
    c.path("M52,820 L106,820 L112,884 L46,884Z","#cfc7b8",w=7)
    A('<g transform="translate(78,780) rotate(-24) scale(1.35)">')
    c.path("M-92,-6 L-100,-52 L-62,-52 L-30,-8Z","#e8505b",w=5)
    c.path("M-62,6 C-80,26 -100,40 -108,46 L-70,46 L-6,8Z","#c93d48",w=5)
    c.path("M-96,-10 C-30,-18 40,-18 96,-8 C112,-4 112,6 96,10 C40,16 -30,16 -96,12Z","#f7f7fb",w=5)
    c.path("M10,-14 C28,-26 54,-20 58,-8 C40,-8 24,-8 10,-8Z","#5ec8ff",w=4)
    A('</g></g>')
    # ---------------- postes
    A('<g filter="url(#mao2)">')
    for lx in (470,1450):
        A(f'<path d="M{lx},860 C{lx+4},760 {lx-4},700 {lx+2},640" stroke="#1d2a44" stroke-width="12" fill="none"/>')
        A(f'<path d="M{lx+2},640 C{lx+2},610 {lx+40},596 {lx+74},604" stroke="#1d2a44" stroke-width="10" fill="none"/>')
        c.path(blob(lx+80,610,26,14,8,.1),"#fff2a8",w=5)
        c.glow(lx+80,626,90,"#fff2a8",.35)
    A('</g>')
    # ---------------- primeiro plano escuro (arbustos nos cantos) – profundidade
    A('<g filter="url(#mao)">')
    for (x,y,w,h) in ((40,1090,520,300),(1880,1095,560,320),(360,1130,380,200),(1580,1135,380,200)):
        d=folhagem(x,y,w,h,8); c.path(d,"#1f6a3d",w=8)
        cl=c.clip(d); A(f'<g clip-path="url(#{cl})"><path d="{blob(x-w*.15,y-h*.25,w*.5,h*.3,8,.15)}" fill="#2f8f4c"/></g>')
    A('</g>')
    c.nostroke("M0,0 H1920 V1080 H0Z",c.rg([(.6,"#000",0),(1,"#0a1430",.45)],.5,.5,.75))
    return c.svg()
open("sonia.svg","w",encoding="utf8").write(build())
