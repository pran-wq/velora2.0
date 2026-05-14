import sys

file_path = '/Users/rahulgowda/Downloads/aether-health real/client/src/screens/Reports.tsx'

with open(file_path, 'r') as f:
    content = f.read()

if 'useSearchParams' not in content:
    content = content.replace("import { useHealthStore } from '../stores/healthStore';", "import { useHealthStore } from '../stores/healthStore';\nimport { useSearchParams, useNavigate } from 'react-router-dom';")

# Locate the function signature and setup params
setup_block = """export default function Reports() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const displayMode = searchParams.get('mode') || 'all';
"""
content = content.replace("export default function Reports() {", setup_block)

# Write mid-way progress to manipulate full lines accurately
with open(file_path, 'w') as f:
    f.write(content)

with open(file_path, 'r') as f:
    lines = f.readlines()

# Inject standard isolation state logic right before return
insertion_idx = -1
for idx, line in enumerate(lines):
    if 'return (' in line and 'if (!profile)' not in line:
        insertion_idx = idx
        break

pre_ret_logic = """
  const showHeader = displayMode === 'all' || displayMode === 'timeline' || displayMode === 'prescriptions';
  const showUploader = displayMode === 'all' || displayMode === 'upload' || displayMode === 'scan';
  const showTimeline = displayMode === 'all' || displayMode === 'timeline' || displayMode === 'prescriptions';

  React.useEffect(() => {
    if (displayMode === 'prescriptions') setActiveCategory('Prescription');
    else if (displayMode === 'timeline') setActiveCategory('All Files');
  }, [displayMode]);
"""
lines.insert(insertion_idx, pre_ret_logic)

content = "".join(lines)

# Add back button to the DIV start
orig_div = 'flex flex-col gap-8 pt-10 sm:pt-16 px-6 md:px-10 pb-36 max-w-[1600px] mx-auto overflow-y-auto no-scrollbar h-full\',\n      isMale ? \'bg-[#FBFBFF]\' : \'\'\n    )}>'
replacement_div = orig_div + """
      <button onClick={() => navigate('/vault')} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 w-fit transition-colors">
         <ArrowRight className="rotate-180" size={16} /> Return to Vault
      </button>"""

content = content.replace(orig_div, replacement_div)

# Wrap the main components in displayMode checks
content = content.replace('<header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">', '{showHeader && <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">')
content = content.replace('</header>', '</header>}')

# Wrap Categories
cat_start = '{/* DYNAMIC CATEGORY STRIP */}'
cat_end = '</div>\n\n      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">'
# We wrap just the strip
content = content.replace(cat_start, '{showHeader && ' + cat_start)
content = content.replace(cat_end, '</div>}\n\n      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">')

# Wrap Upload Section (The big Grid Section)
orig_sect = '<section className="grid grid-cols-1 lg:grid-cols-12 gap-8">'
wrap_sect = '{showUploader && <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">'
content = content.replace(orig_sect, wrap_sect)
# Find where it ends. It ends right before {isPregnant && ( or next grid section.
# Let's manually add closure for this section.
# The section ends at: </section>\n\n      {isPregnant && ('
content = content.replace('</section>\n\n      {isPregnant && (', '</section>}\n\n      {isPregnant && (')
content = content.replace('</section>\n\n      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">', '</section>}\n\n      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">')

# Wrap the Timeline/AI Grid
content = content.replace('<section className="grid grid-cols-1 lg:grid-cols-2 gap-8">', '{showTimeline && <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">')
content = content.replace('</section>\n    </div>\n  );\n}', '</section>}\n    </div>\n  );\n}')

with open(file_path, 'w') as f:
    f.write(content)

print("Successfully constrained shared reports renderer.")
