"""
Realistic UFDR-style benchmark corpus and investigator questions.

The corpus mimics artifacts a field examiner actually queries:
chat threads, call logs, GPS, UPI/crypto, multilingual threats, and deletions.
Gold answers are facts planted in the corpus so retrieval and answer quality
can be scored without a private real case file.
"""

EVAL_SESSION_ID = "eval_benchmark_system"

BENCHMARK_CHUNKS = [
    """UFDR Extract: Cellebrite Physical Analyzer report. Case ID: CYB-2024-1187.
Device: Samsung Galaxy S23, IMEI 356938111234567, Android 14, seized from suspect Rahul Mehta at Andheri West, Mumbai on 2024-09-12 18:40 IST.
Owner WhatsApp account: +91 98765 43210 registered as 'R Mehta'. Alternate SIM: +91 91234 55667.
Email accounts on device: rahul.mehta.trade@gmail.com, rmehta.ops@proton.me.
Lock was bypassed; full file system available including WhatsApp, Telegram, Maps, SMS, and Gallery.""",
    """WhatsApp Chat: chat_id=12036302991, contact='Vikram Bhai' +91 99887 76655.
2024-08-03 21:14: Vikram: bhai parcel kal BKC ke warehouse pe drop kar dena, cash UPI pe le lena.
2024-08-03 21:16: Rahul: ok, UPI ID rmehta@oksbi, amount 4.75 lakh confirm?
2024-08-03 21:17: Vikram: haan, after that BTC address bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
2024-08-04 00:11: Rahul: dropped near One BKC, gate 2. Photo in /sdcard/DCIM/drop_bkc.jpg
Deleted message recovered at 2024-08-04 00:18: 'do not mention courier name in group'.""",
    """Call log and SMS dump.
Outgoing 2024-08-04 00:22 to +91 99887 76655 duration 00:01:47.
Incoming 2024-08-11 14:03 from +971 50 123 4567 (Dubai) duration 00:08:12. Notes in Contacts: 'Farhan - logistics DXB'.
SMS 2024-08-11 14:10 from +971 50 123 4567: 'Shipment left Jebel Ali, AWB 176-99882114, consignee cover name Suresh Iyer'.
SMS 2024-08-12 09:02 to +91 91234 55667: 'keep IMEI phone airplane mode near customs'.""",
    """Location timeline (Google Location History + cell towers).
2024-08-04 00:05 IST: 19.0610 N, 72.8638 E (Bandra Kurla Complex, Mumbai), accuracy 8m.
2024-08-12 16:40 IST: 28.5562 N, 77.1000 E (IGI Airport T3, Delhi).
2024-08-13 02:10 IST: 25.2532 N, 55.3657 E (DXB Airport, Dubai).
Frequent Wi-Fi SSID: 'Mehta-Home-5G' and 'BKC-Guest'. Last home GPS 19.1364 N, 72.8279 E Andheri West.""",
    """Telegram account @rmehta_ops, user_id 847291103.
Group 'Quiet Lane' members: Rahul Mehta, Vikram Bhai, Farhan DXB, unknown handle @silentledger.
2024-08-19 19:02: Farhan: hawala through old Delhi gold shop, not bank.
2024-08-19 19:06: Rahul: ProtonMail rmehta.ops@proton.me for invoices. Password hint stored in Notes: 'BKC475'.
2024-08-20 11:44: @silentledger: mix coins after 2 hops, then send remainder to same bc1 wallet.
Deleted Telegram media recovered: invoice_quietlane_aug.pdf mentioning consignee Suresh Iyer.""",
    """Hindi / Hinglish recovered chat (WhatsApp backup msgstore.db).
2024-09-01 22:31: Vikram: 'kal raat Andheri warehouse lock Tod dena mat, CCTV wala naya laga hai'.
2024-09-01 22:33: Rahul: 'theek hai, courier ka naam group mein mat likhna. Suresh Iyer cover use karo'.
2024-09-02 01:05: Unknown: 'अगर सीमा शुल्क ने पूछा तो फोन फ्लाइट मोड में रखना'.
Keyword hits: chor, parcel, warehouse, customs, cover name.""",
    """Browser and crypto artifacts.
Chrome history: binance.com, wazirx.com, blockchain.com/explorer, 1xbet.com.
Copied BTC address: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
ETH address in notes: 0x71C7656EC7ab88b098defB751B7401B5f6d8976F
UPI transactions via GPay: 475000 INR to vikram.bhai@ybl on 2024-08-03 labeled 'fabric order'.
Accounts app shows Paytm KYC name Rahul Mehta, PAN ABCDE1234F.""",
    """Installed apps and deletions.
WhatsApp, Telegram, Signal (uninstalled 2024-09-10), Gallery Vault, ProtonMail, Maps.
Play Store residual: Signal last used 2024-09-09 23:58.
File system: /sdcard/WhatsApp/Media/deleted_recovered/IMG_4481.jpg geotag 19.0610, 72.8638.
Notes app: 'Farhan +971501234567 / AWB 176-99882114 / do not fly with primary IMEI phone'.
Device accounts also include Samsung account r.mehta.s23@gmail.com.""",
]

GOLD_QUESTIONS = [
    {
        "id": "Q1",
        "category": "identity",
        "query": "Who owns the seized phone and what identifiers are tied to the suspect?",
        "expected_keywords": ["Rahul Mehta", "356938111234567", "98765 43210", "CYB-2024-1187"],
        "expected_entities": ["Rahul Mehta", "+91 98765 43210", "356938111234567"],
        "investigator_need": "Attribute the exhibit to a named suspect with IMEI and phone number.",
    },
    {
        "id": "Q2",
        "category": "communications",
        "query": "Which WhatsApp contact discussed the BKC parcel drop and what UPI ID was used?",
        "expected_keywords": ["Vikram", "99887 76655", "rmehta@oksbi", "One BKC"],
        "expected_entities": ["Vikram Bhai", "+91 99887 76655", "rmehta@oksbi"],
        "investigator_need": "Link a chat counterpart to a payment rail used in the drop.",
    },
    {
        "id": "Q3",
        "category": "crypto",
        "query": "What cryptocurrency addresses and exchange sites appear in the evidence?",
        "expected_keywords": ["bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", "binance"],
        "expected_entities": ["bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"],
        "investigator_need": "Trace wallets for financial intelligence follow-up.",
    },
    {
        "id": "Q4",
        "category": "geolocation",
        "query": "Where was the device around the August 4 drop and which later cities appear in location history?",
        "expected_keywords": ["Bandra Kurla", "19.0610", "IGI Airport", "DXB"],
        "expected_entities": ["19.0610", "72.8638", "Dubai"],
        "investigator_need": "Place the handset at the crime/logistics locations.",
    },
    {
        "id": "Q5",
        "category": "international",
        "query": "What Dubai contact and air-waybill details were recovered from calls or SMS?",
        "expected_keywords": ["Farhan", "+971", "Jebel Ali", "176-99882114", "Suresh Iyer"],
        "expected_entities": ["Farhan", "+971 50 123 4567", "176-99882114"],
        "investigator_need": "Identify cross-border logistics and cover consignee.",
    },
    {
        "id": "Q6",
        "category": "deletions",
        "query": "Which deleted messages or uninstalled apps are forensically relevant?",
        "expected_keywords": ["Deleted", "do not mention courier", "Signal", "invoice_quietlane"],
        "expected_entities": ["Signal", "invoice_quietlane_aug.pdf"],
        "investigator_need": "Surface anti-forensic behavior and recovered deletions.",
    },
    {
        "id": "Q7",
        "category": "multilingual",
        "query": "Summarize the Hindi or Hinglish chats about the warehouse, CCTV, and cover name.",
        "expected_keywords": ["Andheri", "CCTV", "Suresh Iyer", "warehouse"],
        "expected_entities": ["Suresh Iyer", "Andheri"],
        "investigator_need": "Prove the system can use multilingual UFDR text, not English-only.",
    },
    {
        "id": "Q8",
        "category": "payments",
        "query": "List UPI, PAN, and payment amounts connected to Rahul Mehta.",
        "expected_keywords": ["475000", "vikram.bhai@ybl", "ABCDE1234F", "rmehta@oksbi"],
        "expected_entities": ["vikram.bhai@ybl", "ABCDE1234F", "475000"],
        "investigator_need": "Support a money-trail narrative for prosecution.",
    },
    {
        "id": "Q9",
        "category": "accounts",
        "query": "What email accounts and password hints were found on the device?",
        "expected_keywords": ["rahul.mehta.trade@gmail.com", "rmehta.ops@proton.me", "BKC475"],
        "expected_entities": ["rahul.mehta.trade@gmail.com", "rmehta.ops@proton.me"],
        "investigator_need": "Enable lawful follow-up on cloud accounts.",
    },
    {
        "id": "Q10",
        "category": "timeline",
        "query": "Give a short timeline from the BKC drop through the Dubai airport ping.",
        "expected_keywords": ["2024-08-04", "BKC", "2024-08-12", "Delhi", "2024-08-13", "Dubai"],
        "expected_entities": ["2024-08-04", "2024-08-13"],
        "investigator_need": "Produce an investigatory chronology that could go in a case diary.",
    },
]

LIVE_INVESTIGATOR_QUERIES = [
    "Who are the main suspects, contacts, or account owners in this evidence?",
    "List phone numbers, email addresses, and identifiers found in the data.",
    "What locations, GPS coordinates, or cities are mentioned?",
    "What payments, UPI IDs, bank details, or crypto wallets appear?",
    "Were any deleted messages, hidden files, or uninstalled apps recovered?",
    "Summarize the most important timeline of events for an investigator.",
]
