import math, random

# ------------------------------------------------------------------ geometria orgânica
def _cr(p0,p1,p2,p3,k=1.0):
    c1=(p1[0]+(p2[0]-p0[0])/6*k, p1[1]+(p2[1]-p0[1])/6*k)
    c2=(p2[0]-(p3[0]-p1[0])/6*k, p2[1]-(p3[1]-p1[1])/6*k)
    return c1,c2
def smooth_closed(pts,k=1.0):
    n=len(pts); d=f"M{pts[0][0]:.1f},{pts[0][1]:.1f}"
    for i in range(n):
        p0,p1,p2,p3=pts[(i-1)%n],pts[i],pts[(i+1)%n],pts[(i+2)%n]
        c1,c2=_cr(p0,p1,p2,p3,k); d+=f" C{c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {p2[0]:.1f},{p2[1]:.1f}"
    return d+"Z"
def smooth_open(pts,k=1.0):
    P=[pts[0]]+list(pts)+[pts[-1]]; d=f"M{pts[0][0]:.1f},{pts[0][1]:.1f}"
    for i in range(1,len(P)-2):
        c1,c2=_cr(P[i-1],P[i],P[i+1],P[i+2],k); d+=f" C{c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {P[i+1][0]:.1f},{P[i+1][1]:.1f}"
    return d
def blob(cx,cy,rx,ry,n=11,j=.17,rot=0):
    pts=[]
    for i in range(n):
        a=i/n*math.tau+rot; r=1+random.uniform(-j,j)
        pts.append((cx+math.cos(a)*rx*r, cy+math.sin(a)*ry*r))
    return smooth_closed(pts)
def cloud(cx,cy,w,h):
    """nuvem de uma peça só, feita de arcos (cada onda encontra a próxima numa quina natural)"""
    m=random.randint(5,7); x0=cx-w/2; base=cy+h*.3
    wts=[random.uniform(.8,1.3)*(1.25 if 0<i<m-1 else .8) for i in range(m)]
    tot=sum(wts); xs=[x0]
    for q in wts: xs.append(xs[-1]+q/tot*w)
    ys=[base-h*.18*random.uniform(.6,1)]+[base-h*.62*math.sin(math.pi*k/m)*random.uniform(.7,1.05)-h*.1 for k in range(1,m)]+[base-h*.12]
    d=f"M{xs[0]:.1f},{ys[0]:.1f}"
    for i in range(m):
        chord=math.hypot(xs[i+1]-xs[i],ys[i+1]-ys[i]); r=chord/2*random.uniform(1.0,1.18)
        d+=f" A{r:.1f},{r:.1f} 0 0 1 {xs[i+1]:.1f},{ys[i+1]:.1f}"
    d+=f" C{x0+w*.8:.1f},{base+h*.28:.1f} {x0+w*.25:.1f},{base+h*.3:.1f} {xs[0]:.1f},{ys[0]:.1f}Z"
    return d
def folhagem(cx,cy,w,h,lobes=None):
    """copa de árvore/arbusto: contorno em ondas irregulares, uma peça só"""
    lobes=lobes or random.randint(6,9); pts=[]
    for i in range(lobes*3):
        a=i/(lobes*3)*math.tau; bump=1+.22*abs(math.sin(a*lobes/2))+random.uniform(-.05,.05)
        pts.append((cx+math.cos(a)*w/2*bump, cy+math.sin(a)*h/2*bump*(1 if math.sin(a)<0 else .85)))
    return smooth_closed(pts,.9)
def jitter_poly(pts,j=3):
    return [(x+random.uniform(-j,j), y+random.uniform(-j,j)) for x,y in pts]
def poly_d(pts,k=.0):
    return "M"+" L".join(f"{x:.1f},{y:.1f}" for x,y in pts)+"Z"
def wavy_line(x0,y0,x1,y1,amp=6,n=6):
    pts=[]
    for i in range(n+1):
        t=i/n; pts.append((x0+(x1-x0)*t+random.uniform(-amp,amp)*.4, y0+(y1-y0)*t+random.uniform(-amp,amp)))
    return smooth_open(pts)

# ------------------------------------------------------------------ SVG
class Cena:
    def __init__(s,outline="#1b1530",ow=7):
        s.o=outline; s.ow=ow; s.defs=[]; s.body=[]; s.n=0
    def id(s,p="i"): s.n+=1; return f"{p}{s.n}"
    def add(s,x): s.body.append(x)
    def st(s,fill,w=None,stroke=None): return f'fill="{fill}" stroke="{stroke or s.o}" stroke-width="{w if w is not None else s.ow}" stroke-linejoin="round" stroke-linecap="round"'
    def path(s,d,fill,w=None,stroke=None,extra=""): s.add(f'<path d="{d}" {s.st(fill,w,stroke)} {extra}/>')
    def nostroke(s,d,fill,extra=""): s.add(f'<path d="{d}" fill="{fill}" {extra}/>')
    def lg(s,stops,x1=0,y1=0,x2=0,y2=1):
        i=s.id("g"); st="".join(f'<stop offset="{o}" stop-color="{c}" stop-opacity="{a}"/>' for o,c,a in stops)
        s.defs.append(f'<linearGradient id="{i}" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}">{st}</linearGradient>'); return f"url(#{i})"
    def rg(s,stops,cx=.5,cy=.5,r=.5):
        i=s.id("r"); st="".join(f'<stop offset="{o}" stop-color="{c}" stop-opacity="{a}"/>' for o,c,a in stops)
        s.defs.append(f'<radialGradient id="{i}" cx="{cx}" cy="{cy}" r="{r}">{st}</radialGradient>'); return f"url(#{i})"
    def clip(s,d):
        i=s.id("c"); s.defs.append(f'<clipPath id="{i}"><path d="{d}"/></clipPath>'); return i
    def glow(s,cx,cy,r,color,a=.6):
        s.add(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{s.rg([(0,color,a),(1,color,0)])}"/>')
    def svg(s,grain=True):
        f=('<filter id="mao" x="-3%" y="-3%" width="106%" height="106%"><feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves="2" seed="4"/>'
           '<feDisplacementMap in="SourceGraphic" scale="8" xChannelSelector="R" yChannelSelector="G"/></filter>'
           '<filter id="mao2" x="-3%" y="-3%" width="106%" height="106%"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="9"/>'
           '<feDisplacementMap in="SourceGraphic" scale="5" xChannelSelector="R" yChannelSelector="G"/></filter>'
           '<filter id="blur8"><feGaussianBlur stdDeviation="8"/></filter><filter id="blur20"><feGaussianBlur stdDeviation="20"/></filter><filter id="blur4"><feGaussianBlur stdDeviation="3"/></filter>'
           '<filter id="grao" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="2"/>'
           '<feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .9 -.25"/></filter>')
        g='<rect width="1920" height="1080" filter="url(#grao)" opacity=".16"/>' if grain else ""
        return (f'<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><defs>{f}{"".join(s.defs)}</defs>'
                +"".join(s.body)+g+'</svg>')
