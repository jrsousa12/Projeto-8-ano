/* ---------- ilustrações ---------- */
const turtle=(sh,dk,sp)=>`<svg viewBox="0 0 120 80"><ellipse cx="60" cy="72" rx="42" ry="4.5" fill="rgba(0,0,0,.22)"/>
<g class="lg"><ellipse cx="34" cy="64" rx="7" ry="9" fill="#7f8f58"/></g><g class="lg" style="animation-delay:-.4s"><ellipse cx="82" cy="64" rx="7" ry="9" fill="#7f8f58"/></g>
<path d="M12 62 Q12 24 58 24 Q104 24 104 62Z" fill="${sh}"/><path d="M12 62h92v6H12z" fill="#d9c58c"/>
<path d="M36 62 Q38 38 58 33 Q78 38 80 62M58 26V62M24 56 Q30 40 40 34M92 56 Q86 40 76 34" fill="none" stroke="${dk}" stroke-width="2"/>
<ellipse cx="108" cy="52" rx="10" ry="7" fill="#7f8f58"/><circle cx="112" cy="49" r="2" fill="#111"/>${sp}<path d="M12 60l-9 3 9 3z" fill="#7f8f58"/></svg>`;
const wv='<path d="M0 74 Q15 70 30 74 T60 74 T90 74 T120 74" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="2"/>';
const ART={
tartaruga:()=>turtle("#7a6a3a","#54461f",'<ellipse cx="106" cy="47" rx="3.5" ry="1.8" fill="#facc15"/>'),
tracaja:()=>turtle("#5f6b45","#3f4a2c",'<circle cx="105" cy="47" r="1.8" fill="#facc15"/><circle cx="110" cy="54" r="1.5" fill="#facc15"/><circle cx="103" cy="53" r="1.5" fill="#facc15"/>'),
jacare:()=>`<svg viewBox="0 0 120 80"><g class="tl"><path d="M2 54 Q22 40 44 48 L44 60 Q22 64 2 54Z" fill="#4a5a38"/></g>
<g class="lg"><rect x="46" y="58" width="8" height="12" rx="4" fill="#3f4d2f"/></g><g class="lg" style="animation-delay:-.4s"><rect x="78" y="58" width="8" height="12" rx="4" fill="#3f4d2f"/></g>
<rect x="38" y="42" width="62" height="20" rx="10" fill="#566f40"/><path d="M92 44 Q108 40 118 46 L118 54 Q106 60 92 60Z" fill="#566f40"/>
<path d="M92 56 L118 53" stroke="#2f3b22" stroke-width="1.6"/><path d="M99 54l2 3 2-3M108 53.5l2 3 2-3" fill="#fff"/>
<circle cx="100" cy="41" r="4.5" fill="#566f40"/><circle cx="101.5" cy="40" r="1.9" fill="#facc15"/><circle cx="102" cy="40" r=".8" fill="#111"/>
<path d="M44 42l3-5 3 5zM54 42l3-5 3 5zM64 42l3-5 3 5zM74 42l3-5 3 5zM84 42l3-5 3 5z" fill="#3b4a2b"/></svg>`,
onca:()=>`<svg viewBox="0 0 120 80"><ellipse cx="58" cy="76" rx="40" ry="3.5" fill="rgba(0,0,0,.22)"/>
<g class="tl"><path d="M26 42 Q4 40 6 20 Q7 13 13 16 Q12 30 28 36Z" fill="#e8a33a"/></g>
<g class="lg"><rect x="30" y="54" width="9" height="21" rx="4.5" fill="#d9942c"/></g><g class="lg" style="animation-delay:-.4s"><rect x="44" y="54" width="9" height="21" rx="4.5" fill="#e8a33a"/></g>
<g class="lg" style="animation-delay:-.4s"><rect x="72" y="54" width="9" height="21" rx="4.5" fill="#d9942c"/></g><g class="lg"><rect x="86" y="54" width="9" height="21" rx="4.5" fill="#e8a33a"/></g>
<ellipse cx="58" cy="44" rx="36" ry="17" fill="#f0b04a"/><ellipse cx="58" cy="55" rx="30" ry="6" fill="#f8dca0"/>
<circle cx="98" cy="32" r="13" fill="#f0b04a"/><circle cx="90" cy="21" r="4.5" fill="#f0b04a"/><circle cx="106" cy="21" r="4.5" fill="#f0b04a"/>
<ellipse cx="107" cy="38" rx="8" ry="6" fill="#f8dca0"/><ellipse cx="113" cy="35" rx="2.6" ry="2" fill="#3b2a12"/><path class="tg" d="M106 42q2 9 6 1z" fill="#fb7185"/>
<circle cx="102" cy="29" r="2.4" fill="#fff"/><circle cx="102.8" cy="29" r="1.3" fill="#111"/>
<g fill="none" stroke="#3b2a12" stroke-width="2.2"><circle cx="40" cy="40" r="4"/><circle cx="54" cy="36" r="4"/><circle cx="68" cy="40" r="4"/><circle cx="82" cy="37" r="4"/><circle cx="48" cy="50" r="3.5"/><circle cx="62" cy="49" r="3.5"/><circle cx="76" cy="49" r="3.5"/></g>
<g fill="#3b2a12"><circle cx="40" cy="40" r="1"/><circle cx="54" cy="36" r="1"/><circle cx="68" cy="40" r="1"/><circle cx="82" cy="37" r="1"/><circle cx="96" cy="27" r="1.2"/><circle cx="92" cy="35" r="1.2"/></g></svg>`,
guara:()=>`<svg viewBox="0 0 120 80"><g class="lg"><path d="M54 52V78" stroke="#f08080" stroke-width="3" stroke-linecap="round"/></g><g class="lg" style="animation-delay:-.4s"><path d="M64 52V78" stroke="#f08080" stroke-width="3" stroke-linecap="round"/></g>
<path d="M32 42 Q22 44 16 54 Q30 52 40 48Z" fill="#e0322b"/><ellipse cx="56" cy="42" rx="26" ry="14" fill="#e0322b"/>
<path d="M74 40 Q92 34 90 22 Q89 14 94 14" fill="none" stroke="#e0322b" stroke-width="7" stroke-linecap="round"/>
<circle cx="96" cy="14" r="6.5" fill="#e0322b"/><path d="M100 12 Q118 12 116 34 Q110 20 99 18Z" fill="#2b2b2b"/><circle cx="97" cy="12" r="1.6" fill="#111"/>
<path d="M36 40 Q54 48 76 40 Q60 56 36 40Z" fill="#ff6b61" opacity=".6"/></svg>`,
boto:()=>`<svg viewBox="0 0 120 80"><path d="M12 50 Q38 22 76 32 Q94 36 104 42 L119 43 L119 48 L102 50 Q86 64 54 64 Q26 64 12 50Z" fill="#f4a9bd"/>
<path d="M30 40 Q44 24 60 28 Q52 34 36 44Z" fill="#e58aa4"/><path d="M12 50 Q2 44 0 32 Q10 38 18 44Z M12 50 Q0 56 0 68 Q10 60 18 54Z" fill="#e58aa4"/>
<path d="M60 56 Q68 72 80 70 Q74 62 70 56Z" fill="#e58aa4"/><circle cx="92" cy="40" r="2.2" fill="#333"/><path d="M96 48 Q106 50 118 47" stroke="#d0708a" stroke-width="1.5" fill="none"/>${wv}</svg>`,
peixeboi:()=>`<svg viewBox="0 0 120 80"><ellipse cx="14" cy="42" rx="14" ry="12" fill="#7a8896"/><ellipse cx="60" cy="42" rx="42" ry="21" fill="#8795a3"/>
<ellipse cx="100" cy="44" rx="16" ry="14" fill="#8795a3"/><ellipse cx="112" cy="49" rx="7" ry="5.5" fill="#6e7b88"/><circle cx="105" cy="38" r="1.9" fill="#111"/>
<ellipse cx="84" cy="58" rx="13" ry="5" transform="rotate(30 84 58)" fill="#6e7b88"/><path d="M110 55q3 3 6 0" stroke="#4d5964" stroke-width="1.2" fill="none"/>${wv}</svg>`,
pirarucu:()=>`<svg viewBox="0 0 120 80"><path d="M14 40 L0 26 Q8 40 0 54Z" fill="#c2410c"/><ellipse cx="56" cy="40" rx="48" ry="14" fill="#6f7f5a"/><ellipse cx="26" cy="40" rx="22" ry="13" fill="#b4351a" opacity=".9"/>
<path d="M92 32 Q108 33 118 42 Q108 50 92 48Z" fill="#6f7f5a"/><circle cx="106" cy="38" r="2" fill="#111"/><path d="M104 45 L118 43" stroke="#3d4a33" stroke-width="1.4"/>
<path d="M32 28 Q40 18 52 28Z M34 52 Q42 62 52 52Z" fill="#b4351a"/><path d="M80 48 Q86 60 92 56 Q88 52 86 48Z" fill="#5a6a47"/>
<g stroke="#4f5e3d" fill="none" stroke-width="1.2" opacity=".7"><path d="M60 30q4 5 0 10M68 30q4 5 0 10M76 31q4 5 0 10M52 38q4 5 0 10M60 40q4 5 0 10M68 40q4 5 0 10M76 41q4 5 0 8"/></g>${wv}</svg>`,
caranguejo:()=>`<svg viewBox="0 0 120 80"><g stroke="#4a5784" stroke-width="3.5" stroke-linecap="round" fill="none"><path d="M36 50 L16 58 L10 70M38 54 L22 68 L18 78M42 58 L34 74M84 50 L104 58 L110 70M82 54 L98 68 L102 78M78 58 L86 74"/></g>
<path d="M50 32v-9M70 32v-9" stroke="#4a5784" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="21" r="4" fill="#fff"/><circle cx="70" cy="21" r="4" fill="#fff"/><circle cx="51" cy="21" r="1.8" fill="#111"/><circle cx="71" cy="21" r="1.8" fill="#111"/>
<ellipse cx="60" cy="46" rx="27" ry="17" fill="#5d6c9a"/><path d="M60 32v28M42 40q10 8 18 6M78 40q-10 8-18 6" stroke="#47547f" stroke-width="1.6" fill="none"/>
<path d="M84 40 Q98 34 102 20" stroke="#4a5784" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M96 18 Q112 6 114 24 Q106 26 102 20Z" fill="#d97757"/>
<path d="M36 40 Q24 36 20 28" stroke="#4a5784" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M14 26 Q22 16 26 28Z" fill="#d97757"/></svg>`,
harpia:()=>`<svg viewBox="0 0 120 80"><rect x="0" y="68" width="120" height="7" rx="3" fill="#6b4a2b"/>
<path d="M44 68 Q38 32 60 24 Q82 32 76 68Z" fill="#555e6b"/><path d="M52 68 Q50 44 60 40 Q70 44 68 68Z" fill="#f1f1ee"/>
<path d="M50 48 Q60 54 70 48" stroke="#2f3640" stroke-width="4" fill="none"/>
<circle cx="60" cy="20" r="12" fill="#9aa3ad"/><path d="M52 12 L44 2M60 9 L60 -1M68 12 L76 2" stroke="#2f3640" stroke-width="3" stroke-linecap="round"/>
<path d="M65 23 Q80 22 76 36 Q70 31 65 29Z" fill="#2f3640"/><circle cx="64" cy="18" r="2.2" fill="#fff"/><circle cx="64.6" cy="18" r="1.2" fill="#111"/>
<path d="M50 68 l-4 9 M54 68 l-1 10 M66 68 l1 10 M70 68 l4 9" stroke="#e6c84f" stroke-width="3" stroke-linecap="round"/></svg>`,
sapo:()=>`<svg viewBox="0 0 120 80"><ellipse cx="58" cy="72" rx="38" ry="4" fill="rgba(0,0,0,.2)"/>
<path d="M32 60 Q16 54 12 72 L38 72 Q46 66 42 58Z" fill="#7a5b38"/><rect x="78" y="58" width="7" height="14" rx="3.5" fill="#7a5b38"/>
<ellipse cx="58" cy="52" rx="34" ry="20" fill="#8b6b45"/><ellipse cx="88" cy="42" rx="18" ry="14" fill="#8b6b45"/>
<circle cx="92" cy="30" r="7.5" fill="#d9c27a"/><circle cx="93" cy="30" r="3.4" fill="#111"/><path d="M70 36 Q78 30 84 38 Q78 46 70 42Z" fill="#6f5232"/>
<path d="M96 49 Q104 52 108 47" stroke="#4a3520" stroke-width="2" fill="none"/>
<g fill="#6f5232"><circle cx="46" cy="44" r="2.6"/><circle cx="56" cy="38" r="2.2"/><circle cx="40" cy="54" r="2.4"/><circle cx="58" cy="52" r="2.6"/><circle cx="68" cy="56" r="2.2"/><circle cx="50" cy="62" r="2.2"/></g>
<ellipse cx="60" cy="64" rx="22" ry="6" fill="#d8c79c" opacity=".7"/></svg>`,
ariranha:()=>`<svg viewBox="0 0 120 80"><path d="M0 62 Q15 56 30 62 T60 62 T90 62 T120 62 V80 H0Z" fill="rgba(56,140,190,.45)"/>
<path d="M6 52 Q-2 50 0 44 Q10 46 16 50Z" fill="#4a2f1b"/><path d="M4 54 Q20 40 46 42 Q78 40 96 44 Q108 48 108 56 Q100 64 88 62 Q60 68 30 64 Q12 64 4 54Z" fill="#5a3a22"/>
<circle cx="100" cy="44" r="12" fill="#5a3a22"/><ellipse cx="109" cy="48" rx="7" ry="5.5" fill="#6d4a2e"/><ellipse cx="112" cy="46" rx="2.2" ry="1.6" fill="#111"/>
<circle cx="102" cy="40" r="2" fill="#111"/><circle cx="94" cy="34" r="3" fill="#5a3a22"/><path d="M92 54 Q102 64 114 54 Q104 60 92 54Z" fill="#f1ddb0"/>
<path d="M112 50 l8 -2M112 52 l8 2" stroke="#e5d3a8" stroke-width="1" /><ellipse cx="84" cy="62" rx="7" ry="4" fill="#4a2f1b"/></svg>`
};
const DISART={
caramujo:`<svg viewBox="0 0 120 80"><path d="M8 66 Q60 58 112 66 L112 72 H8Z" fill="#8a9a5b"/><path d="M92 64 Q104 40 110 28" stroke="#8a9a5b" stroke-width="10" stroke-linecap="round" fill="none"/><circle cx="52" cy="40" r="26" fill="#d9a066"/><circle cx="52" cy="40" r="18" fill="none" stroke="#8a5a2b" stroke-width="3"/><circle cx="52" cy="40" r="10" fill="none" stroke="#8a5a2b" stroke-width="3"/><circle cx="52" cy="40" r="3" fill="#8a5a2b"/><circle cx="108" cy="26" r="2.4" fill="#111"/></svg>`,
tenia:`<svg viewBox="0 0 120 80"><path d="M8 54 Q22 26 38 54 T68 54 T98 50" fill="none" stroke="#f0e2c4" stroke-width="12" stroke-linecap="round"/><path d="M8 54 Q22 26 38 54 T68 54 T98 50" fill="none" stroke="#b59b6a" stroke-width="12" stroke-dasharray="1.6 8"/><circle cx="104" cy="48" r="8" fill="#f0e2c4"/><circle cx="102" cy="46" r="1.6" fill="#7c6a40"/><circle cx="107" cy="46" r="1.6" fill="#7c6a40"/><circle cx="102" cy="51" r="1.6" fill="#7c6a40"/><circle cx="107" cy="51" r="1.6" fill="#7c6a40"/></svg>`,
lombriga:`<svg viewBox="0 0 120 80"><path d="M10 60 Q30 20 52 50 T96 36 Q108 32 112 40" fill="none" stroke="#f3a6a0" stroke-width="13" stroke-linecap="round"/><path d="M10 60 Q30 20 52 50 T96 36" fill="none" stroke="#dd7f78" stroke-width="13" stroke-dasharray="1.2 11"/><circle cx="108" cy="38" r="1.6" fill="#7a2f2a"/></svg>`,
amarelao:`<svg viewBox="0 0 120 80"><path d="M14 30 Q36 8 56 30 T98 26" fill="none" stroke="#f0c53c" stroke-width="8" stroke-linecap="round"/><path d="M16 62 Q38 40 58 62 T100 58" fill="none" stroke="#e0a82a" stroke-width="8" stroke-linecap="round"/><path d="M96 24l6-2M98 56l6-2" stroke="#8a6a12" stroke-width="3" stroke-linecap="round"/></svg>`,
mosquito:`<svg viewBox="0 0 120 80"><ellipse cx="50" cy="26" rx="20" ry="7" transform="rotate(-25 50 26)" fill="rgba(255,255,255,.6)"/><ellipse cx="62" cy="24" rx="20" ry="6" transform="rotate(-10 62 24)" fill="rgba(255,255,255,.45)"/><ellipse cx="50" cy="44" rx="22" ry="8" fill="#6b5a4a"/><circle cx="76" cy="42" r="7" fill="#6b5a4a"/><path d="M82 43 L110 50" stroke="#333" stroke-width="2.2" stroke-linecap="round"/><circle cx="78" cy="39" r="1.8" fill="#fff"/><path d="M38 38v14M46 37v14M54 37v14" stroke="#e8ddd0" stroke-width="2"/><path d="M40 50l-8 14M50 52l-2 16M60 50l8 14M66 46l12 12" stroke="#4a3c30" stroke-width="2" stroke-linecap="round" fill="none"/></svg>`
};
const emo=e=>`<svg viewBox="0 0 120 80"><text x="60" y="62" font-size="56" text-anchor="middle">${e}</text></svg>`;
