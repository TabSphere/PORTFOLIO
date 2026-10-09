from pathlib import Path
from bs4 import BeautifulSoup
from PIL import Image
import base64, re, mimetypes

root = Path(__file__).resolve().parents[1]
prefix = 'assets/img/conservation-media/mockups/'
def figure(key, title):
    src = prefix + key + '.png'
    w, h = Image.open(root / src).size
    return BeautifulSoup(f'<figure class="gd-artwork media-mockup"><a href="{src}" target="_blank" rel="noopener"><img src="{src}" width="{w}" height="{h}" loading="lazy" decoding="async" alt="{title}, studio presentation mockup"></a><figcaption><h3>{title}</h3><a href="{src}" target="_blank" rel="noopener">View full size ↗</a></figcaption></figure>', 'html.parser').figure

close = BeautifulSoup((root/'close-season.html').read_text(), 'html.parser')
if not close.select('.media-mockup'):
    close.select_one('main > figure').insert_before(figure('campaign-2021', 'Close-season campaign · 2021'))
    close.select_one('main > .gd-grid').insert_before(figure('campaign-2022', 'Close-season campaign · 2022'))
(root/'close-season.html').write_text(str(close))
staff = BeautifulSoup((root/'staff-awareness.html').read_text(), 'html.parser')
sections = staff.select('main > section')
if not staff.select('.media-mockup'):
    sections[1].select_one('.gd-grid').insert_before(figure('health', 'Health & wellbeing'))
    sections[2].select_one('.gd-grid').insert_before(figure('fire', 'Fire safety communications'))
(root/'staff-awareness.html').write_text(str(staff))

# Preview contains the two updated design stories, with original artwork retained.
# Videos remain unchanged in the website; this lightweight review focuses on mockups.
doc = BeautifulSoup('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Campaign Mockup Review</title></head><body></body></html>', 'html.parser')
css = '\n'.join((root/p).read_text() for p in ['assets/css/portfolio.css','assets/css/graphic-design.css','assets/css/conservation-media.css'])
def embed_match(m):
    src = m.group(1).strip('"\'')
    p = (root/'assets/css'/src.split('?')[0]).resolve()
    if p.is_file():
        return 'url("data:'+ (mimetypes.guess_type(str(p))[0] or 'application/octet-stream') + ';base64,' + base64.b64encode(p.read_bytes()).decode() + '")'
    return m.group(0)
css = re.sub(r'url\(([^)]+)\)', embed_match, css)
css += '\n.review-note{padding:18px;text-align:center;background:#f7edcf;color:#222}.review-tabs{display:flex;gap:24px;justify-content:center;padding:20px;flex-wrap:wrap}.media-mockup img{display:block;width:100%;height:auto;object-fit:contain}.review-story{scroll-margin-top:24px}\n'
style=doc.new_tag('style');style.string=css;doc.head.append(style)
doc.body.append(BeautifulSoup('<div class="review-note">Mockup review · Live portfolio unchanged</div><nav class="review-tabs"><a href="#campaigns">Close-season campaigns</a><a href="#staff">Staff communications</a></nav>', 'html.parser'))
doc.body.append(close.header)
for soup, ident in [(close,'campaigns'),(staff,'staff')]:
    main=soup.main;main['id']=ident;main['class'].append('review-story')
    for video in main.select('section:has(video)'):
        video.decompose()
    for nav in main.select('.media-next'):nav.decompose()
    for a in main.select('a.gd-link'):a.decompose()
    doc.body.append(main)
for i, img in enumerate(doc.select('img')):
    p=root/img['src']
    data='data:'+(mimetypes.guess_type(str(p))[0] or 'image/png')+';base64,'+base64.b64encode(p.read_bytes()).decode()
    original=img['src'];img['src']=data
    img['id']='review-art-'+str(i)
    for a in doc.select('a[href]'):
        if a['href']==original:
            a['href']='#'+img['id']
            a.attrs.pop('target',None)
    img['loading']='eager'
out=root.parent/'preview/Campaign_Mockup_Review.html';out.write_text(str(doc))
assert len(doc.select('.media-mockup'))==4
assert len(doc.select('main .gd-artwork img'))==13
assert not doc.select('img[src^="assets/"]')
print(f'Preview: {out} ({out.stat().st_size} bytes); 4 mockups, 9 original designs')
