from lib import *
random.seed(8)
TV=dict(x=655,y=345,w=450,h=300,r=54)     # tela de vidro (usada também pela animação)
def rr(x,y,w,h,r,j=2,k=.8):
    pts=[(x+r,y),(x+w-r,y),(x+w,y+r),(x+w,y+h-r),(x+w-r,y+h),(x+r,y+h),(x,y+h-r),(x,y+r)]
    return smooth_closed(jitter_poly(pts,j),k)
def build():
    c=Cena(outline="#1a0f24",ow=7); A=c.add
    # ---------------- parede
    A(f'<rect width="1920" height="1080" fill="{c.lg([(0,"#1b2f55",1),(.6,"#3a2a70",1),(1,"#4b2a6b",1)])}"/>')
    cols=["#ff4fa3","#ffd23f","#33d6ff","#7cff8a"]
    A('<g filter="url(#mao2)" opacity=".5">')
    for i in range(46):   # confete / memphis em traços curvos
        x,y=random.randint(0,1920),random.randint(0,540); col=random.choice(cols); t=random.random()
        if t<.4: A(f'<path d="{smooth_open([(x,y),(x+25,y-14),(x+50,y+10),(x+78,y-8)])}" stroke="{col}" stroke-width="6" fill="none" stroke-linecap="round"/>')
        elif t<.75: A(f'<path d="{blob(x,y,random.randint(14,24),random.randint(10,18),9,.2)}" stroke="{col}" stroke-width="5" fill="none"/>')
        else: A(f'<path d="M{x},{y-14} L{x+14},{y+10} L{x-14},{y+10}Z" stroke="{col}" stroke-width="5" fill="none" stroke-linejoin="round"/>')
    A('</g>')
    c.glow(960,420,760,"#33a8ff",.28)
    # ---------------- lambri de madeira
    A('<g filter="url(#mao)">')
    c.path("M-40,580 L1960,580 L1960,830 L-40,830Z",c.lg([(0,"#8a5231",1),(1,"#5a321f",1)]),w=7)
    for x in range(-20,1960,92):
        A(f'<path d="{wavy_line(x,590,x+random.uniform(-4,4),826,3,5)}" stroke="#2f180f" stroke-width="5" fill="none" opacity=".75"/>')
        A(f'<path d="{wavy_line(x+30,600,x+34,800,6,4)}" stroke="#b2763f" stroke-width="3" fill="none" opacity=".35"/>')
    c.path("M-40,548 L1960,552 L1960,596 L-40,592Z","#b57a45",w=7)
    c.nostroke("M-40,548 L1960,552 L1960,562 L-40,558Z","#e0a56a",'opacity=".7"')
    A('</g>')
    # ---------------- luzinhas penduradas
    A('<g filter="url(#mao2)">')
    for (x0,x1,y0,sag) in ((-20,1000,60,120),(900,1940,50,130)):
        pts=[(x0+(x1-x0)*t, y0+math.sin(t*math.pi)*sag) for t in [i/10 for i in range(11)]]
        A(f'<path d="{smooth_open(pts)}" stroke="#1a0f24" stroke-width="5" fill="none"/>')
        for i,(bx,by) in enumerate(pts[1:-1]):
            col=cols[i%4]; c.glow(bx,by+16,44,col,.7); c.path(blob(bx,by+14,9,13,7,.1),col,w=4)
    A('</g>')
    # ---------------- placa de neon
    A('<g filter="url(#mao2)">')
    for off,col,wd,fl in ((0,"#33d6ff",26,"blur20"),):
        A(f'<text x="960" y="205" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-size="108" fill="none" stroke="{col}" stroke-width="{wd}" filter="url(#{fl})" opacity=".8">RIVER RAID</text>')
    A('<text x="960" y="205" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-size="108" fill="none" stroke="#9ff3ff" stroke-width="7" stroke-linejoin="round">RIVER RAID</text>')
    A('<text x="960" y="205" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-size="108" fill="none" stroke="#fff" stroke-width="2.5" stroke-linejoin="round">RIVER RAID</text>')
    A(f'<path d="{smooth_open([(640,236),(780,252),(960,240),(1150,254),(1280,238)])}" stroke="#ff4fa3" stroke-width="22" fill="none" filter="url(#blur8)" opacity=".8"/>')
    A(f'<path d="{smooth_open([(640,236),(780,252),(960,240),(1150,254),(1280,238)])}" stroke="#ffd0ea" stroke-width="6" fill="none" stroke-linecap="round"/>')
    A('</g>')
    # ---------------- pôsteres
    A('<g filter="url(#mao2)">')
    def poster(x,y,w,h,rot,kind):
        A(f'<g transform="rotate({rot} {x+w/2} {y+h/2})">')
        c.path(rr(x,y,w,h,8,3,.5),"#f4e9d0",w=7)
        inner=rr(x+12,y+12,w-24,h-24,6,2,.5); 
        if kind==0:
            c.path(inner,c.lg([(0,"#2b1b6b",1),(.55,"#ff4f8a",1),(1,"#ffb347",1)]),w=5)
            cl=c.clip(inner); A(f'<g clip-path="url(#{cl})"><path d="{blob(x+w/2,y+h*.62,w*.32,w*.32,12,.03)}" fill="#ffe066" stroke="#1a0f24" stroke-width="5"/>')
            for k in range(4): A(f'<path d="M{x},{y+h*.62+k*14+8} L{x+w},{y+h*.62+k*14+8}" stroke="#2b1b6b" stroke-width="{3+k*2}"/>')
            A(f'<path d="M{x},{y+h} L{x+w*.3},{y+h*.7} L{x+w*.55},{y+h*.85} L{x+w*.8},{y+h*.65} L{x+w},{y+h}Z" fill="#1a0f3a"/></g>')
        else:
            c.path(inner,c.lg([(0,"#33b8ff",1),(1,"#1f5fd0",1)]),w=5)
            A(f'<g transform="translate({x+w/2},{y+h*.5}) rotate(-90) scale(1.15)"><path d="M-40,0 C-10,-14 30,-12 46,0 C30,12 -10,14 -40,0Z M-8,-4 L-32,-36 L-14,-36 L14,-4Z M-8,4 L-32,36 L-14,36 L14,4Z" fill="#ffe14d" stroke="#1a0f24" stroke-width="5"/></g>')
        A('</g>')
    poster(190,250,170,230,-4,0); poster(400,300,140,190,3,1); poster(1580,270,170,230,3,1); poster(1370,320,140,190,-3,0)
    A('</g>')
    # ---------------- fliperama esquerdo e direito
    A('<g filter="url(#mao)">')
    def fliper(x,y,w,h,body,dark,tela,seed):
        random.seed(seed)
        d=poly_d(jitter_poly([(x+30,y),(x+w-30,y),(x+w,y+h*.34),(x+w-10,y+h*.5),(x+w+6,y+h),(x-6,y+h),(x+10,y+h*.5),(x,y+h*.34)],3))
        c.path(d,body,w=8)
        cl=c.clip(d); A(f'<g clip-path="url(#{cl})"><path d="M{x+w*.72},{y} L{x+w+20},{y} L{x+w+20},{y+h} L{x+w*.7},{y+h}Z" fill="{dark}" opacity=".6"/></g>')
        c.path(rr(x+w*.14,y+h*.07,w*.72,h*.13,10,2),"#fff3c4",w=6)       # letreiro
        c.glow(x+w/2,y+h*.135,110,"#ffe066",.5)
        A(f'<text x="{x+w/2}" y="{y+h*.17}" text-anchor="middle" font-family="Arial Black, Impact" font-size="{h*.075}" fill="#d8344a" stroke="#1a0f24" stroke-width="3" paint-order="stroke">PLAY!</text>')
        sc=rr(x+w*.14,y+h*.25,w*.72,h*.24,16,3); c.path(sc,c.lg([(0,tela,1),(1,"#0b1a3a",1)]),w=7)
        c.glow(x+w/2,y+h*.37,w*.9,tela,.35)
        for k in range(4):   # pixels do jogo
            A(f'<path d="{blob(x+w*(.28+k*.14),y+h*(.33+.04*(k%2)),9,7,7,.2)}" fill="#fff" opacity=".85"/>')
        c.path(rr(x+w*.08,y+h*.53,w*.84,h*.1,12,2),dark,w=6)                # painel de controle
        c.path(blob(x+w*.3,y+h*.52,12,12,8,.1),"#ff3b3b",w=5); A(f'<path d="M{x+w*.3},{y+h*.52} L{x+w*.3},{y+h*.57}" stroke="#1a0f24" stroke-width="6"/>')
        for k,col in enumerate(("#ffe14d","#33d6ff","#7cff8a")): c.path(blob(x+w*(.55+k*.1),y+h*.575,10,8,8,.1),col,w=4)
        c.path(rr(x+w*.2,y+h*.7,w*.6,h*.28,10,3),dark,w=6)
        for k in range(3): A(f'<path d="{blob(x+w*(.34+k*.16),y+h*.8,13,17,8,.2)}" fill="{random.choice(cols)}" opacity=".85"/>')
    fliper(400,360,190,480,"#d8468f","#8a1e5e","#33d6ff",3)
    fliper(1340,370,200,470,"#2fb7a8","#177a70","#ffd23f",5)
    A('</g>')
    # ---------------- móvel e TV
    A('<g filter="url(#mao)">')
    # móvel
    c.path("M560,712 L1360,712 L1366,830 L554,830Z",c.lg([(0,"#9a5e35",1),(1,"#5a321f",1)]),w=8)
    c.path("M548,698 L1372,698 L1372,730 L548,730Z","#c4864f",w=7)
    c.path(rr(590,744,300,72,10,3),"#2b170f",w=6); c.path(rr(930,744,400,72,10,3),"#2b170f",w=6)
    # console escuro com joysticks
    c.path(rr(610,764,200,44,8,2),"#2d2323",w=5); c.path("M616,764 L806,764 L806,778 L616,778Z","#6a4328",w=4)
    for k in range(4): A(f'<path d="M{640+k*34},786 L{648+k*34},786" stroke="#d9c9a0" stroke-width="6" stroke-linecap="round"/>')
    for jx in (830,858): c.path(blob(jx,790,14,10,8,.1),"#1a1018",w=4); A(f'<path d="M{jx},790 L{jx+4},766" stroke="#1a0f24" stroke-width="7"/>'); c.path(blob(jx+4,762,9,9,8,.1),"#ff3b3b",w=4)
    for k in range(5): c.path(rr(960+k*54,770,40,40,5,3),random.choice(("#f4d35e","#5ec2ff","#ef476f","#06d6a0","#fff1d0")),w=5)   # cartuchos
    # pés
    for px in (580,1320): c.path(f"M{px},828 L{px+26},828 L{px+30},866 L{px-4},866Z","#3a1f13",w=6)
    # corpo da TV
    c.path(rr(610,300,700,402,48,3,.9),c.lg([(0,"#b57a45",1),(.5,"#8f5a32",1),(1,"#6a3f22",1)]),w=9)
    for k in range(9): A(f'<path d="{wavy_line(630+k*78,312,630+k*78+random.uniform(-6,6),690,4,6)}" stroke="#4a2a16" stroke-width="3" fill="none" opacity=".45"/>')
    c.path(rr(640,330,480,330,64,3,.9),"#24160f",w=7)          # moldura do tubo
    # tela de vidro (a animação desenha aqui dentro)
    t=TV; sc=rr(t["x"],t["y"],t["w"],t["h"],t["r"],0,.9)
    c.path(sc,c.lg([(0,"#10281c",1),(1,"#05110c",1)]),w=6)
    c.path(rr(1140,330,150,330,26,3),"#3d2515",w=7)            # painel lateral
    for k in range(9): A(f'<path d="M1160,{368+k*14} L1270,{368+k*14}" stroke="#150a05" stroke-width="5" stroke-linecap="round"/>')
    for (kx,ky) in ((1215,500),(1215,580)):
        c.path(blob(kx,ky,30,30,12,.04),"#d9cdb6",w=6); A(f'<path d="M{kx},{ky} L{kx+10},{ky-18}" stroke="#1a0f24" stroke-width="7" stroke-linecap="round"/>')
    A('<text x="1215" y="470" text-anchor="middle" font-family="Arial Black, Impact" font-size="18" fill="#f5e6c8">VOL  CH</text>')
    # antena coelho
    A('<g stroke="#1a0f24" stroke-width="9" fill="none" stroke-linecap="round"><path d="M930,300 L850,214"/><path d="M990,300 L1070,208"/></g>')
    A('<g stroke="#d9d9e6" stroke-width="4" fill="none" stroke-linecap="round"><path d="M930,300 L850,214"/><path d="M990,300 L1070,208"/></g>')
    for (bx,by) in ((848,210),(1072,204)): c.path(blob(bx,by,11,11,8,.1),"#d9d9e6",w=5)
    A('</g>')
    # ---------------- chão (carpete 80s)
    A('<g filter="url(#mao)">')
    c.path("M-40,810 L1960,810 L1960,1100 L-40,1100Z",c.lg([(0,"#241a4a",1),(1,"#150e2e",1)]),w=7)
    c.nostroke("M-40,810 L1960,810 L1960,850 L-40,850Z",c.lg([(0,"#000",.45),(1,"#000",0)]))
    for i in range(60):
        k=(i/60); y=840+random.random()**.8*240; s=.6+(y-810)/300*.9; x=random.randint(-20,1940); col=random.choice(("#ff4f6d","#33a8ff","#a855f7","#ffd23f"))
        t=random.random()
        if t<.30: A(f'<path d="{blob(x,y,random.randint(46,72)*s,random.randint(12,22)*s,12,.1)}" stroke="#ef476f" stroke-width="{5*s:.1f}" fill="none"/>')
        elif t<.55: A(f'<path d="{smooth_open([(x,y),(x+40*s,y-12*s),(x+86*s,y+8*s),(x+130*s,y-6*s)])}" stroke="#a855f7" stroke-width="{5*s:.1f}" fill="none" stroke-linecap="round"/>')
        elif t<.8: A(f'<path d="{rr(x,y,56*s,34*s,6*s,3*s,.7)}" stroke="#33a8ff" stroke-width="{5*s:.1f}" fill="none" transform="rotate({random.randint(-25,25)} {x} {y})"/>')
        else: A(f'<path d="M{x},{y} L{x+18*s},{y-14*s} L{x+36*s},{y}" stroke="#ffd23f" stroke-width="{5*s:.1f}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>')
    A('</g>')
    A(f'<ellipse cx="900" cy="930" rx="640" ry="150" fill="{c.rg([(0,"#33a8ff",.5),(1,"#33a8ff",0)])}"/>')   # luz da TV no tapete
    # ---------------- abajur de pé (esq) e planta (dir)
    A('<g filter="url(#mao2)">')
    c.glow(110,520,300,"#ffd78a",.55)
    c.path("M96,840 L128,840 L122,420 L102,420Z","#3a2a22",w=7)
    c.path(blob(112,860,60,16,10,.1),"#3a2a22",w=7)
    c.path("M40,430 C48,360 80,330 112,330 C146,330 180,360 188,430Z",c.lg([(0,"#ffe9a8",1),(1,"#ffb347",1)]),w=7)
    c.path(blob(1830,860,70,20,10,.1),"#6a3f22",w=7); c.path("M1770,860 L1790,780 L1870,780 L1890,860Z","#c4623a",w=7)
    for (dx,dy,rot) in ((-30,-60,-40),(0,-90,0),(30,-60,40),(-60,-30,-70),(60,-30,70)):
        A(f'<g transform="translate({1830+dx},{780+dy}) rotate({rot})"><path d="M0,0 C-28,-40 -22,-100 0,-130 C22,-100 28,-40 0,0Z" fill="#2fa84f" stroke="#1a0f24" stroke-width="6" stroke-linejoin="round"/><path d="M0,0 L0,-120" stroke="#1d7a38" stroke-width="4"/></g>')
    A('</g>')
    A(f'<rect width="1920" height="1080" fill="{c.rg([(.55,"#000",0),(1,"#0a0420",.55)],.5,.5,.78)}"/>')
    return c.svg()
open("carol.svg","w",encoding="utf8").write(build())
