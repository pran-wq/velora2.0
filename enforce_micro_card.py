import sys

files_config = [
    {
        'path': '/Users/rahulgowda/Downloads/aether-health real/client/src/screens/male-dynamics/Profile.tsx',
        'gender': 'Male',
        'id_prefix': 'AHM',
        'primary_color': '#818CF8',
        'secondary_color': 'indigo',
        'accents': 'cyan-300',
        'bg_glow': 'from-[#E0E7FF] via-[#F1F5F9] to-[#E0F2FE]'
    },
    {
        'path': '/Users/rahulgowda/Downloads/aether-health real/client/src/screens/female-dynamics/Profile.tsx',
        'gender': 'Female',
        'id_prefix': 'AHF',
        'primary_color': '#F472B6',
        'secondary_color': 'pink',
        'accents': 'orange-200',
        'bg_glow': 'from-[#FDF2F8] via-[#F1F5F9] to-[#FCE7F3]'
    },
    {
        'path': '/Users/rahulgowda/Downloads/aether-health real/client/src/screens/pregnancy-dynamics/Profile.tsx',
        'gender': 'Pregnant (Week 24)',
        'id_prefix': 'AHP',
        'primary_color': '#F472B6',
        'secondary_color': 'pink',
        'accents': 'rose-200',
        'bg_glow': 'from-[#FFF1F2] via-[#F1F5F9] to-[#FFE4E6]'
    }
]

for conf in files_config:
    file_path = conf['path']
    print(f"Updating {file_path} with definitive micro-card...")

    with open(file_path, 'r') as f:
        lines = f.readlines()

    # Find start line (the wrapper div)
    start_line = -1
    for idx, line in enumerate(lines):
        if 'className="bg-white/60 backdrop-blur-2xl rounded-' in line and 'max-w-[' in line:
            start_line = idx
            break
    
    if start_line == -1:
        # Try previous iteration matching
        for idx, line in enumerate(lines):
            if 'backdrop-blur-2xl' in line and 'flex-col' in line:
                start_line = idx
                break
    
    if start_line == -1:
        print(f"FATAL ERROR: Could not locate card start in {file_path}")
        continue

    # Find end line
    target_end = -1
    for idx in range(start_line + 1, len(lines)):
        if '{/* MEDICAL RECORDS */}' in lines[idx]:
            for look_back in range(idx-1, start_line, -1):
                if '</div>' in lines[look_back]:
                    target_end = look_back
                    break
            break
    
    if target_end == -1:
        print(f"FATAL ERROR: Could not locate card end in {file_path}")
        continue

    c = conf['primary_color']
    g = conf['gender']
    pref = conf['id_prefix']
    bg = conf['bg_glow']
    acc = conf['accents']

    # Define replacement content as the ABSOLUTELY COMPACT MINI-CARD
    replacement_content = f"""            <div className="bg-white/70 backdrop-blur-2xl rounded-[24px] p-4 md:p-5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.08)] border border-white/90 relative overflow-hidden flex flex-col ring-1 ring-white/60 max-w-[580px] w-full mx-auto">
               {/* Ultra Tight Background Effects */}
               <div className="absolute top-0 right-0 w-48 h-48 bg-{conf['secondary_color']}-300/10 rounded-full blur-[40px] -z-10 pointer-events-none translate-x-1/3 -translate-y-1/3" />
               <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-white/30 pointer-events-none" />

               {/* Tight Header */}
               <div className="flex justify-between items-center relative z-10 mb-3">
                 <div className="flex items-center gap-2">
                   <div className="w-7 h-7 bg-[{c}] rounded-lg flex items-center justify-center shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
                     <span className="font-black text-white text-sm">A</span>
                   </div>
                   <div>
                     <h4 className="font-black text-[#1E1B4B] text-sm uppercase leading-none tracking-tight">Aether</h4>
                     <p className="text-[8px] font-bold text-[{c}] tracking-widest uppercase">Health</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-2">
                   <span className="text-[8px] font-bold text-[{c}] uppercase tracking-[0.1em]">Health ID</span>
                   <div className="w-4 h-4 rounded-full bg-[{c}]/10 flex items-center justify-center text-[{c}]">
                     <Shield size={8} className="fill-[{c}]/20" />
                   </div>
                 </div>
               </div>

               {/* THE CORE GRID - FORCED SIDE BY SIDE ALWAYS */}
               <div className="grid grid-cols-[1fr_1px_120px] md:grid-cols-[1fr_1px_140px] gap-3 md:gap-4 relative z-10 mb-3 items-start">
                 
                 {/* LEFT COL */}
                 <div className="flex flex-col">
                   <div className="flex items-center gap-3 mb-2">
                     <div className="relative flex-shrink-0">
                       <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[{c}] to-{acc} opacity-50 blur-[2px]" />
                       <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-white shadow-md overflow-hidden bg-indigo-50 flex-shrink-0">
                         <img src={{`https://api.dicebear.com/7.x/avataaars/svg?seed=${{profile.name}}&backgroundColor=f8fafc`}} alt="U" className="w-full h-full object-cover" />
                       </div>
                     </div>
                     <div className="flex flex-col min-w-0">
                       <h2 className="text-base md:text-lg font-extrabold text-[#1E1B4B] tracking-tight truncate">YG EMPIRE</h2>
                       <div className="flex items-center gap-1.5 text-[9px] font-medium text-[#64748B]">
                         <span>{{profile.age}} Yrs</span>
                         <span className="w-1 h-1 bg-gray-300 rounded-full" />
                         <span>{g}</span>
                       </div>
                       <div className="flex mt-0.5">
                         <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white/60 backdrop-blur-sm border border-white rounded-full shadow-sm">
                           <Droplets size={10} className="text-red-500" />
                           <span className="font-bold text-[#1E1B4B] text-[9px]">O+</span>
                           <span className="text-[8px] text-[#64748B] hidden md:inline">Blood Group</span>
                         </div>
                       </div>
                     </div>
                   </div>

                   <div className="w-full h-px bg-gradient-to-r from-gray-200/50 via-gray-200/50 to-transparent mb-2" />

                   {/* Compact Medical Manifest */}
                   <div className="space-y-1.5">
                     {[
                       {{ label: 'Allergies', val: 'None', icon: ShieldAlert }},
                       {{ label: 'Conditions', val: 'None', icon: Activity }},
                       {{ label: 'Meds', val: 'Vit D, Iron', icon: FileText }},
                       {{ label: 'Contact', val: '+91 98765 43210', icon: Phone }},
                     ].map((row, i) => (
                       <div key={{i}} className="flex items-center gap-2">
                         <div className="w-4 flex justify-center flex-shrink-0 text-[{c}]/70">
                           <row.icon size={12} />
                         </div>
                         <div className="w-14 md:w-16 uppercase tracking-wider font-bold text-[7px] text-[{c}] flex-shrink-0">
                           {{row.label}}
                         </div>
                         <div className="font-semibold text-[#1E293B] text-[9px] truncate">
                           {{row.val}}
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>

                 {/* VERTICAL DIVIDER */}
                 <div className="h-full w-px bg-gradient-to-b from-transparent via-gray-200/60 to-transparent" />

                 {/* RIGHT COL (QR + DATES) */}
                 <div className="flex flex-col items-center gap-2">
                   <div className="bg-white/80 backdrop-blur-md p-2 rounded-xl shadow-sm border border-white flex flex-col items-center w-full max-w-[100px]">
                     <div className="bg-white rounded-lg p-0.5 w-full aspect-square">
                       <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=HEALTH-ID&color=1e1b4b" alt="Q" className="w-full h-full mix-blend-multiply" />
                     </div>
                     <p className="text-[6px] font-black text-[#64748B] text-center mt-1 uppercase tracking-widest">Scan ID</p>
                   </div>

                   <div className="flex flex-col gap-1.5 w-full">
                     <div className="flex items-center gap-1.5">
                       <div className="w-6 h-6 bg-white/60 border border-white rounded-md flex flex-shrink-0 items-center justify-center text-[{c}]">
                         <Calendar size={12} />
                       </div>
                       <div className="min-w-0">
                         <p className="text-[6px] uppercase font-bold text-[{c}] truncate">Birth</p>
                         <p className="text-[8px] font-bold text-[#1E293B] truncate">May 12, 1992</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-1.5">
                       <div className="w-6 h-6 bg-white/60 border border-white rounded-md flex flex-shrink-0 items-center justify-center text-[{c}]">
                         <Shield size={12} />
                       </div>
                       <div className="min-w-0">
                         <p className="text-[6px] uppercase font-bold text-[{c}] truncate">Issued</p>
                         <p className="text-[8px] font-bold text-[#1E293B] truncate">May 20, 2024</p>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Micro Footer */}
               <div className="-mx-4 -mb-4 md:-mx-5 md:-mb-5 mt-auto px-4 py-2 bg-gradient-to-r {bg} flex justify-between items-center border-t border-white/50 backdrop-blur-sm">
                 <div className="flex items-center gap-1.5 text-[{c}]">
                   <Shield size={10} className="fill-[{c}]/20" />
                   <span className="text-[8px] font-bold text-[#475569]">Verified Identity</span>
                 </div>
                 <div className="text-[8px] font-bold text-[#64748B]">
                   <span className="text-[{c}] font-black mr-1">{pref} ID:</span> {pref}-8F3X
                 </div>
               </div>
            </div>\n"""

    # Write line override logic
    lines[start_line : target_end+1] = [replacement_content]
    
    with open(file_path, 'w') as f:
        f.writelines(lines)
    
    print(f"SUCCESS for {file_path}")

print("All files optimized successfully with forced-compact landscape modes!")
