import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path('.tools/pypdf').resolve()))
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / '实验报告_纸间书店_Vue3_GitHub版.pdf'
OUT = ROOT / 'report_page_map.json'
INDEX = ROOT / 'report_page_index.json'

reader = PdfReader(str(PDF))
pages = [(page.extract_text() or '') for page in reader.pages]

def norm(text):
    return re.sub(r'\s+', '', text)

normalized = [norm(text) for text in pages]

body_start = next(
    (index for index, text in enumerate(normalized) if 'CHAPTER01/OVERVIEW' in text and '01实验概述' in text),
    None,
)
if body_start is None:
    raise SystemExit('Cannot locate body start.')

chapters = [
    ('01', '01实验概述'),
    ('02', '02开发环境与技术选型'),
    ('03', '03需求分析与总体设计'),
    ('04', '04Vue3知识点覆盖与实现'),
    ('05', '05核心页面与功能实现'),
    ('06', '06关键代码解析'),
    ('07', '07测试与运行结果'),
    ('08', '08部署与公网访问'),
    ('09', '09问题与解决'),
    ('10', '10总结与体会'),
    ('A', '附录A：27个单文件组件清单'),
    ('B', '附录B：参考文献'),
]

page_map = {}
cursor = body_start
for key, needle in chapters:
    for index in range(cursor, len(normalized)):
        if needle in normalized[index]:
            page_map[key] = index - body_start + 1
            cursor = index
            break
    else:
        raise SystemExit(f'Cannot locate chapter {key} ({needle}).')

OUT.write_text(json.dumps(page_map, ensure_ascii=False, indent=2), 'utf-8')

figure_pages = {}
for index, text in enumerate(pages):
    for match in re.findall(r'(图\s*\d+-\d+|表\s*\d+-\d+|代码\s*\d+-\d+)', text):
        label = re.sub(r'\s+', '', match)
        if label not in figure_pages:
            figure_pages[label] = index + 1
INDEX.write_text(
    json.dumps(
        {
            'total_pdf_pages': len(pages),
            'body_start_pdf_page': body_start + 1,
            'page_map': page_map,
            'objects': figure_pages,
        },
        ensure_ascii=False,
        indent=2,
    ),
    'utf-8',
)

print('PDF pages:', len(pages))
print('Body starts at PDF page:', body_start + 1)
print('Page map:', page_map)
for key in sorted(figure_pages, key=lambda item: (int(re.findall(r'\d+', item)[0]), int(re.findall(r'\d+', item)[1]))):
    print(key, '->', figure_pages[key])
