export interface DrugInfo {
  id: string;
  name: string;
  type: 'generic' | 'brand';
  genericName: string;
  rxNormQuery: string; // The standard name used for RxNorm API queries (US spelling)
  category: string;
  localBrands: string[];
  description: string;
  usage: string;
  dosage: string;
  sideEffects: string[];
  warnings: string[];
  pidginAdvice: string;
}

export const NIGERIAN_DRUGS_DATABASE: DrugInfo[] = [
  {
    id: "paracetamol",
    name: "Paracetamol",
    type: "generic",
    genericName: "Paracetamol",
    rxNormQuery: "Acetaminophen",
    category: "Pain & Fever Relief",
    localBrands: ["Panadol", "Emzor Paracetamol", "M&B Paracetamol", "Boska", "Cafenol"],
    description: "A very common medicine used to reduce mild-to-moderate pain (like headaches or body aches) and lower fever.",
    usage: "Used for general headache, body pain, toothache, and cold/flu fevers.",
    dosage: "Adults: 1 or 2 tablets (500mg - 1000mg) every 4 to 6 hours. Do not exceed 8 tablets (4000mg) in 24 hours.",
    sideEffects: [
      "Rare when taken correctly.",
      "Liver damage (if you take too much).",
      "Skin rash (rare allergic reaction)."
    ],
    warnings: [
      "DO NOT take this with other medicines that contain paracetamol (like cold/flu remedies) to avoid liver damage.",
      "Avoid heavy alcohol intake while taking paracetamol.",
      "If fever lasts more than 3 days, see a doctor."
    ],
    pidginAdvice: "No use paracetamol pass as dem write body. Too much of am fit damage your liver. If body hot pass 3 days, make you run go see doctor o."
  },
  {
    id: "panadol",
    name: "Panadol",
    type: "brand",
    genericName: "Paracetamol",
    rxNormQuery: "Acetaminophen",
    category: "Pain & Fever Relief",
    localBrands: ["Emzor Paracetamol", "M&B Paracetamol", "Boska"],
    description: "A popular brand of paracetamol sold in Nigeria.",
    usage: "Used for general headache, body pain, toothache, and cold/flu fevers.",
    dosage: "Adults: 1 or 2 tablets (500mg - 1000mg) every 4 to 6 hours. Do not exceed 8 tablets in 24 hours.",
    sideEffects: ["Liver damage if abused.", "Skin rashes (rare)."],
    warnings: [
      "Do not combine with other paracetamol brands (like Emzor or Boska) or cold/flu drugs containing paracetamol.",
      "Liver toxicity is a major risk if dosage limits are exceeded."
    ],
    pidginAdvice: "Panadol na just Paracetamol brand name. No combine am with Emzor paracetamol or Boska, na the same drug dem be. Liver damage no get spare part!"
  },
  {
    id: "boska",
    name: "Boska",
    type: "brand",
    genericName: "Paracetamol + Caffeine",
    rxNormQuery: "Acetaminophen and Caffeine",
    category: "Pain & Fever Relief",
    localBrands: ["Cafenol", "Panadol Extra"],
    description: "A strong pain reliever containing paracetamol mixed with caffeine to boost its effectiveness.",
    usage: "Used for intense headaches, migraines, joint pains, and severe body pain.",
    dosage: "Adults: 1 or 2 tablets every 6 hours. Maximum 8 tablets per day.",
    sideEffects: [
      "Difficulty sleeping or restlessness (due to caffeine).",
      "Fast heartbeat or palpitations.",
      "Stomach irritation."
    ],
    warnings: [
      "Contains caffeine. Limit intake of coffee, tea, or cola drinks while using this.",
      "Avoid taking close to bedtime to prevent sleeplessness.",
      "Do not take with other paracetamol brands."
    ],
    pidginAdvice: "Boska get caffeine inside, na why e dey clear head quick. No take am near night if you wan sleep. And no mix am with normal paracetamol."
  },
  {
    id: "artemether-lumefantrine",
    name: "Artemether + Lumefantrine",
    type: "generic",
    genericName: "Artemether + Lumefantrine",
    rxNormQuery: "Artemether and Lumefantrine",
    category: "Anti-Malaria",
    localBrands: ["Coartem", "Lokmal", "Lonart", "Amatem", "P-Alaxin", "Lornart"],
    description: "The first-choice combination therapy used to treat acute, uncomplicated malaria infections caused by Plasmodium falciparum.",
    usage: "Used to treat active malaria. Must only be taken when malaria is confirmed (via test) or strongly suspected.",
    dosage: "Adults (over 35kg): 4 tablets immediately, 4 tablets after 8 hours, then 4 tablets twice daily (morning & night) for the next 2 days (Total of 24 tablets).",
    sideEffects: [
      "Loss of appetite.",
      "Dizziness or weakness.",
      "Muscle or joint pain.",
      "Headache."
    ],
    warnings: [
      "Take with fatty food or milk (like liquid peak milk or a meal with oil) to help the body absorb the medicine properly.",
      "Complete the full 3-day dose (24 tablets total) even if you feel better after the first day, otherwise the malaria will return stronger.",
      "This is for treatment, not prevention (prophylaxis)."
    ],
    pidginAdvice: "Make you take this malaria medicine with food (especially milk or oily food) so e go work well. Complete the 3-day pack! If you stop halfway, the malaria go return back."
  },
  {
    id: "coartem",
    name: "Coartem",
    type: "brand",
    genericName: "Artemether + Lumefantrine",
    rxNormQuery: "Artemether and Lumefantrine",
    category: "Anti-Malaria",
    localBrands: ["Lokmal", "Lonart", "Amatem", "P-Alaxin"],
    description: "A premium, widely-known brand of Artemether + Lumefantrine anti-malarial medication.",
    usage: "Treats active malaria infections.",
    dosage: "Adults: 4 tablets start, 4 tablets after 8 hours, then 4 tablets twice daily for the next 2 days (24 tablets total).",
    sideEffects: ["Headache", "Dizziness", "Mild stomach upset."],
    warnings: [
      "Must be taken with a fatty meal or milk for absorption.",
      "Do not skip doses. Complete the full 24-tablet course."
    ],
    pidginAdvice: "Coartem na malaria drug. E get 24 tablets inside. Take 4 now, 4 in 8 hours time, then 4 twice a day. Make you chop oil food or drink milk before you take am."
  },
  {
    id: "lonart",
    name: "Lonart",
    type: "brand",
    genericName: "Artemether + Lumefantrine",
    rxNormQuery: "Artemether and Lumefantrine",
    category: "Anti-Malaria",
    localBrands: ["Coartem", "Lokmal", "Amatem", "P-Alaxin"],
    description: "A highly trusted brand of malaria medication in Nigeria, available in adult and pediatric formulations (Lonart Kid).",
    usage: "Treatment of uncomplicated malaria.",
    dosage: "Adults: 24 tablets total over 3 days (4 tablets at 0, 8 hours, then 12-hour intervals).",
    sideEffects: ["Dizziness", "Tiredness", "Stomach ache."],
    warnings: [
      "Always take with food.",
      "Ensure you complete the dosage to prevent resistance."
    ],
    pidginAdvice: "Lonart na the same thing with Coartem. E dey treat malaria. Drink am with milk or oily soup so your body fit draw the power."
  },
  {
    id: "piroxicam",
    name: "Piroxicam",
    type: "generic",
    genericName: "Piroxicam",
    rxNormQuery: "Piroxicam",
    category: "Pain & Inflammatory Relief (NSAID)",
    localBrands: ["Felvin", "Pirox"],
    description: "A strong non-steroidal anti-inflammatory drug (NSAID) used to relieve pain, swelling, and joint stiffness.",
    usage: "Used for severe joint pain, arthritis, menstrual pain, and muscle strains. Often heavily self-medicated in Nigeria for general body pain.",
    dosage: "Adults: Usually 20mg once daily. Always take with or immediately after food.",
    sideEffects: [
      "Stomach ulcers or bleeding (high risk!).",
      "Heartburn and indigestion.",
      "Dizziness or headaches.",
      "Kidney damage with prolonged use."
    ],
    warnings: [
      "CRITICAL: Never take this on an empty stomach. It can erode your stomach lining and cause bleeding.",
      "Avoid combining with other NSAID pain relievers like Diclofenac (Cataflam), Ibuprofen, or Aspirin.",
      "Do not use for standard headaches or minor pain where paracetamol would suffice."
    ],
    pidginAdvice: "Felvin (Piroxicam) na strong painkiller but e dey cause stomach ulcer quick-quick. NEVER drink am on empty stomach! No mix am with Cataflam or Ibuprofen."
  },
  {
    id: "felvin",
    name: "Felvin",
    type: "brand",
    genericName: "Piroxicam",
    rxNormQuery: "Piroxicam",
    category: "Pain & Inflammatory Relief (NSAID)",
    localBrands: ["Pirox"],
    description: "A very popular brand name for Piroxicam in Nigeria, widely used for general body and joint pains.",
    usage: "Joint pains, swelling, arthritis, severe back pain.",
    dosage: "Adults: 1 capsule (20mg) daily after food.",
    sideEffects: ["Stomach ulceration", "Stomach bleeding", "Nausea", "Acid reflux."],
    warnings: [
      "Very high risk of stomach ulcers. Must be taken with food.",
      "Do not take for everyday mild headaches. Use paracetamol instead."
    ],
    pidginAdvice: "Felvin na Piroxicam. Plenti people dey abuse am for body pain. E dey chew stomach lining if you no chop food before you take am. Shine your eye!"
  },
  {
    id: "diclofenac",
    name: "Diclofenac",
    type: "generic",
    genericName: "Diclofenac",
    rxNormQuery: "Diclofenac",
    category: "Pain & Inflammatory Relief (NSAID)",
    localBrands: ["Cataflam", "Voltaren", "Diclomed"],
    description: "A potent NSAID medication used to reduce inflammation and relieve severe acute pain.",
    usage: "Used for severe toothache, menstrual cramps, arthritis, post-surgery pain, and joint injuries.",
    dosage: "Adults: 50mg to 100mg daily in divided doses (usually 50mg twice or thrice daily) after meals.",
    sideEffects: [
      "Stomach irritation or pain.",
      "Nausea and diarrhea.",
      "High blood pressure or fluid retention.",
      "Increased risk of heart attack or stroke with long-term use."
    ],
    warnings: [
      "Take after meals. Can irritate the stomach.",
      "Avoid if you have a history of stomach ulcers, asthma (can trigger attacks), or heart issues.",
      "Do not take with other painkillers of the same family (like Ibuprofen, Felvin, or Aspirin)."
    ],
    pidginAdvice: "Diclofenac (Cataflam) na hot painkiller. Take am after food. If you get ulcer or high blood pressure, consult doctor before you touch am."
  },
  {
    id: "cataflam",
    name: "Cataflam",
    type: "brand",
    genericName: "Diclofenac",
    rxNormQuery: "Diclofenac",
    category: "Pain & Inflammatory Relief (NSAID)",
    localBrands: ["Voltaren", "Diclomed"],
    description: "A well-known brand of Diclofenac potassium that works rapidly to relieve acute pain and inflammation.",
    usage: "Toothaches, severe menstrual pain, injuries, and joint pains.",
    dosage: "Adults: 50mg up to 3 times daily after food.",
    sideEffects: ["Stomach pain", "Heartburn", "Dizziness."],
    warnings: [
      "Do not take on an empty stomach.",
      "People with stomach ulcers or severe hypertension should avoid it."
    ],
    pidginAdvice: "Cataflam na Diclofenac. E dey work fast for toothache and menstrual pain, but e fit tear your stomach if you dey drink am on empty belly."
  },
  {
    id: "metronidazole",
    name: "Metronidazole",
    type: "generic",
    genericName: "Metronidazole",
    rxNormQuery: "Metronidazole",
    category: "Antibiotics / Antiprotozoals",
    localBrands: ["Flagyl", "Metro"],
    description: "An antibiotic and antiprotozoal medication used to treat bacterial and parasitic infections (such as amoebic dysentery, dental infections, and pelvic infections).",
    usage: "Used for stomach infections (toilet infections, watery stool), dental abscesses, and specific bacterial vaginosis.",
    dosage: "Adults: 200mg - 400mg three times daily for 5 to 7 days. Must be taken with or after food.",
    sideEffects: [
      "Metallic taste in the mouth.",
      "Nausea or vomiting.",
      "Darkened urine (harmless)."
    ],
    warnings: [
      "CRITICAL: Do NOT drink alcohol while taking metronidazole, and for at least 48 hours after finishing the dose. The combination causes severe vomiting, rapid heart rate, flushing, and intense headaches.",
      "Ensure you complete the full course prescribed, even if symptoms stop early, to prevent antibiotic resistance."
    ],
    pidginAdvice: "NEVER drink alcohol (beer, gin, kai-kai) when you dey take Flagyl! The reaction go make you vomit, your head go block, and your heart go dey beat gbagam-gbagam."
  },
  {
    id: "flagyl",
    name: "Flagyl",
    type: "brand",
    genericName: "Metronidazole",
    rxNormQuery: "Metronidazole",
    category: "Antibiotics / Antiprotozoals",
    localBrands: ["Metro"],
    description: "The most popular brand name for Metronidazole in Nigeria, commonly used for stomach upsets and diarrhea.",
    usage: "Watery stool, bacterial stomach infection, pelvic inflammation.",
    dosage: "Adults: 400mg three times daily for 5-7 days after meals.",
    sideEffects: ["Metallic taste", "Nausea", "Headache."],
    warnings: [
      "Absolutely no alcohol during use and for 2 days after.",
      "Do not take self-prescribed Flagyl for every simple stomach ache."
    ],
    pidginAdvice: "Flagyl na Metronidazole. No drink any alcohol at all when you dey take am. Chop food before you drink am so your stomach no go hook."
  },
  {
    id: "amoxicillin",
    name: "Amoxicillin",
    type: "generic",
    genericName: "Amoxicillin",
    rxNormQuery: "Amoxicillin",
    category: "Antibiotics (Penicillins)",
    localBrands: ["Amoxil", "Beecham Amoxicillin"],
    description: "A moderate-spectrum antibiotic used to treat a wide variety of bacterial infections.",
    usage: "Infections of the ear, throat (strep throat), urinary tract, and skin. Frequently misused in Nigeria for common cold/cough (which are viral).",
    dosage: "Adults: 250mg - 500mg three times daily (every 8 hours) for 5 to 7 days.",
    sideEffects: [
      "Diarrhea or loose stools.",
      "Nausea or vomiting.",
      "Allergic rash (severe hives require immediate doctor visit)."
    ],
    warnings: [
      "DO NOT take this for viral colds, flu, or catarrh. Antibiotics do not cure viruses.",
      "Finish the entire prescribed pack! Stopping early leaves surviving bacteria to mutate into 'superbugs' that resist treatment.",
      "Confirm you do not have a Penicillin allergy before taking."
    ],
    pidginAdvice: "Amoxicillin na antibiotic. No take am treat common cold or catarrh, e no go work. If doctor write am for you, drink all the capsules inside the pack, no stop halfway!"
  },
  {
    id: "augmentin",
    name: "Augmentin",
    type: "brand",
    genericName: "Amoxicillin + Clavulanic Acid",
    rxNormQuery: "Amoxicillin and Clavulanate Potassium",
    category: "Antibiotics (Penicillins)",
    localBrands: ["Fleming", "Co-amoxiclav"],
    description: "A powerful combination antibiotic containing amoxicillin and clavulanate potassium to overcome bacterial resistance.",
    usage: "Used for stubborn respiratory, urinary, sinus, and soft tissue bacterial infections.",
    dosage: "Adults: Typically 625mg or 1g twice daily (every 12 hours) for 5 to 7 days, taken at the start of a meal.",
    sideEffects: [
      "Severe diarrhea (very common due to clavulanic acid).",
      "Stomach upset.",
      "Yeast infections (thrush) in women."
    ],
    warnings: [
      "A strong antibiotic that should only be used when prescribed by a professional.",
      "Taking it at the start of a meal reduces stomach upset and improves absorption.",
      "Complete the dose. Watch out for severe allergic reactions if you are sensitive to penicillin."
    ],
    pidginAdvice: "Augmentin na heavy antibiotic. E dey make belly run sometimes. No buy am self-medicate because e strong. Chop food before you take am, and complete the dose."
  },
  {
    id: "septriin",
    name: "Septrin",
    type: "brand",
    genericName: "Co-trimoxazole",
    rxNormQuery: "Sulfamethoxazole and Trimethoprim",
    category: "Antibiotics (Sulfa Drugs)",
    localBrands: ["Co-trimoxazole"],
    description: "A combination antibiotic containing sulfamethoxazole and trimethoprim, widely used in Nigeria.",
    usage: "Urinary tract infections (UTIs), chest infections, and historically for cholera or traveler's diarrhea.",
    dosage: "Adults: 1 or 2 tablets (double strength or standard) twice daily (every 12 hours) for 5-7 days.",
    sideEffects: [
      "Skin rashes (can be very severe).",
      "Nausea and vomiting.",
      "Sensitivity to sunlight."
    ],
    warnings: [
      "CRITICAL: Many people have severe allergies to 'Sulfa' drugs. If you develop a rash, blisters, or skin peeling, STOP taking it immediately and go to a hospital. It can trigger Stevens-Johnson Syndrome (SJS).",
      "Drink plenty of water while taking Septrin to prevent crystals from forming in your kidneys."
    ],
    pidginAdvice: "Septrin get sulfa inside. Plenti people dey allergy to am. If you take am finish, body start to scratch you or rash dey comot, STOP AM immediately! Drink plenti water."
  },
  {
    id: "gaviscon",
    name: "Gaviscon",
    type: "brand",
    genericName: "Sodium Alginate + Sodium Bicarbonate + Calcium Carbonate",
    rxNormQuery: "Sodium Alginate and Sodium Bicarbonate and Calcium Carbonate",
    category: "Antacids & Acid Reflux",
    localBrands: ["Gestid", "Actal", "Magnesium Trisilicate"],
    description: "A fast-acting antacid that forms a protective barrier over the stomach contents to prevent acid reflux (heartburn).",
    usage: "Heartburn, acid indigestion, sour stomach, and stomach ulcers.",
    dosage: "Adults: 10ml to 20ml of liquid suspension, or 2 to 4 chewable tablets after meals and at bedtime.",
    sideEffects: ["Constipation or diarrhea (depending on formulation).", "Stomach bloating."],
    warnings: [
      "Antacids can block or reduce the absorption of other medications (especially antibiotics like Ciprofloxacin or Tetracycline).",
      "Do NOT take other medicines within 2 hours before or after taking an antacid."
    ],
    pidginAdvice: "Gaviscon dey coat stomach to stop heartburn. But make you no drink am close to your other drugs, e go block their power. Give space of 2 hours."
  },
  {
    id: "dexamethasone",
    name: "Dexamethasone",
    type: "generic",
    genericName: "Dexamethasone",
    rxNormQuery: "Dexamethasone",
    category: "Corticosteroids",
    localBrands: ["Dexa", "Dexona"],
    description: "A potent steroid hormone used to reduce severe inflammation and suppress the immune system.",
    usage: "Severe allergic reactions, asthma attacks, autoimmune flare-ups. Strictly prescription-only.",
    dosage: "Must be custom-prescribed. Dose must be tapered off gradually; do not stop suddenly.",
    sideEffects: [
      "Rapid weight gain (water retention and fat deposit).",
      "High blood sugar (can trigger diabetes).",
      "Thinning of bones (osteoporosis).",
      "Weakened immune system (easy infections)."
    ],
    warnings: [
      "DANGER: Frequently abused in local Nigerian markets to gain weight or bleach skin. This causes severe, permanent endocrine damage, kidney failure, high blood pressure, and sudden death.",
      "Never self-medicate with steroids. Stopping suddenly after long use can cause life-threatening adrenal crisis."
    ],
    pidginAdvice: "DANGER! No use Dexa or 'steroids' because you wan fat. The fat na swelling (water) and e dey destroy kidney, liver and bones. E fit cause sudden death!"
  },
  {
    id: "tramadol",
    name: "Tramadol",
    type: "generic",
    genericName: "Tramadol",
    rxNormQuery: "Tramadol",
    category: "Opioid Analgesic",
    localBrands: ["Tramal", "Tramadol"],
    description: "A strong opioid pain reliever used to treat moderate to severe pain.",
    usage: "Severe pain post-surgery or major injury. Highly controlled substance.",
    dosage: "Strictly as prescribed by a medical doctor.",
    sideEffects: [
      "Extreme drowsiness and dizziness.",
      "Nausea and severe constipation.",
      "Addiction, dependence, and breathing difficulties."
    ],
    warnings: [
      "CRITICAL: High potential for addiction and drug abuse. In Nigeria, illegal high-dose tramadol (e.g. 200mg/250mg) is sold on the streets—taking this can cause seizures, coma, and death.",
      "Never mix with alcohol or other sedatives."
    ],
    pidginAdvice: "Tramadol na heavy drug wey dey hook person like cocaine. High dose fit give you seizure or send you go early grave. Keep off if doctor no write am!"
  }
];

// Helper to look up a drug by any query (brand or generic)
export function lookupDrug(query: string): DrugInfo | undefined {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return undefined;

  // 1. Direct search by ID or name
  let found = NIGERIAN_DRUGS_DATABASE.find(
    d => d.id === cleanQuery || d.name.toLowerCase() === cleanQuery
  );
  if (found) return found;

  // 2. Search brand names
  found = NIGERIAN_DRUGS_DATABASE.find(d => 
    d.localBrands.some(brand => brand.toLowerCase() === cleanQuery)
  );
  if (found) return found;

  // 3. Partial match name
  found = NIGERIAN_DRUGS_DATABASE.find(d => 
    d.name.toLowerCase().includes(cleanQuery) || 
    d.genericName.toLowerCase().includes(cleanQuery)
  );
  if (found) return found;

  // 4. Partial match brand names
  found = NIGERIAN_DRUGS_DATABASE.find(d => 
    d.localBrands.some(brand => brand.toLowerCase().includes(cleanQuery))
  );

  return found;
}
