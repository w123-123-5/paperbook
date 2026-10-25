from pathlib import Path
from PIL import Image

SRC = Path('shots')
OUT = Path('report_assets')
OUT.mkdir(exist_ok=True)

selected = {
    'fig-home-hero': '01-home-hero.png',
    'fig-home-featured': '02-home-featured.png',
    'fig-home-collections': '03-home-collections.png',
    'fig-shelf-hero': '05-shelf-hero.png',
    'fig-shelf-grid': '23-shelf-grid-clean.png',
    'fig-shelf-list': '07-shelf-list.png',
    'fig-detail-top': '08-detail-top.png',
    'fig-detail-reviews': '09-detail-reviews.png',
    'fig-about-hero': '11-about-hero.png',
    'fig-contact-success': '24-contact-success.png',
    'fig-mobile-home': '15-mobile-home.png',
    'fig-mobile-menu': '19-mobile-menu.png',
    'fig-drawer': '20-drawer.png',
    'fig-night': '21-home-night.png',
}

for target, source in selected.items():
    image = Image.open(SRC / source).convert('RGB')
    # Keep enough pixels for 14 cm wide placement at ~250 dpi, cap at 1400 px.
    if image.width > 1400:
        height = round(image.height * 1400 / image.width)
        image = image.resize((1400, height), Image.LANCZOS)
    image.save(OUT / f'{target}.jpg', 'JPEG', quality=90, optimize=True, subsampling=0)
    print(target, image.size)
