with open('src/app/tabel/sumber-dana/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix: replace broken part - the invalid < size={17} /> tag and duplicate title attrs
# Pattern: title="" title=" TS">< size={17} /><Edit size={17} /></button>
# Replace with: title="Edit TS"><Edit size={17} /></button>

content = content.replace(
    'handle(currentYearItem)}',
    'handleEdit(currentYearItem)}'
)

content = content.replace(
    'title="" title=" TS">< size={17} /><Edit size={17} /></button>',
    'title="Edit TS"><Edit size={17} /></button>'
)

with open('src/app/tabel/sumber-dana/page.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('Done')
