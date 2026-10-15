# -*- coding: utf-8 -*-
"""One-shot: expand then clamp planner-d articles to 900–1100 words."""
from __future__ import annotations

import sys
from pathlib import Path

DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(DIR))

import _gen_planner_d as gen
from _expand_planner_d import expand, EXTRAS


def clamp(a: dict) -> dict:
    # Trim while over 1100
    while gen.count_article(a) > 1100:
        if len(a["sections"]) > 8 and a["sections"][-1].get("heading"):
            a["sections"].pop()
            continue
        trimmed = False
        for sec in reversed(a["sections"]):
            if len(sec["paragraphs"]) > 2:
                sec["paragraphs"].pop()
                trimmed = True
                break
        if not trimmed:
            # last resort: pop last faq
            if len(a["faqs"]) > 3:
                a["faqs"].pop()
            else:
                break

    title = a["title"]
    pads = [
        {
            "heading": "ما الذي تحتفظ به قبل المحاولة التالية؟",
            "paragraphs": [
                f"قبل أي خطوة جديدة حول «{title}» احفظ لقطة الشاشة الحالية واسم المستخدم في مجلد واحد. اللقطة تمنع تضارب التواريخ بين المحاولات. لا تضع كلمة المرور في المجلد ولا في المحادثة.",
                "اقرأ نص رسالة ميتا أو إنستغرام حرفاً بحرف قبل اختيار نموذج جديد. في استرجاع انستا نقرأ اللقطة ونسمّي المسار المناسب. لا نطلب كلمة المرور، ولا نضمن قرار المنصة. راجع صفحة الخدمات والأسئلة الشائعة إن احتجت حدود المساعدة.",
                "أوقف المحاولات العشوائية من روابط التعليقات أثناء الانتظار. جهاز واحد وطلب واحد مرتب أوضح للمراجع من عشر نقرات في ساعة. بعد أي رد جديد صوّره بجانب اللقطة الأولى وقارن التاريخين قبل إعادة الصياغة.",
            ],
        },
        {
            "heading": "كيف تتجنب إضعاف الملف أثناء الانتظار؟",
            "paragraphs": [
                f"أثناء انتظار رد ميتا في موضوع «{title}» لا تنشئ حسابات بديلة تنشر نفس المادة المتنازع عليها. التكرار يُقرأ استمراراً للمشكلة لا حلاً. أبقِ القناة البديلة للزبائن بلا أسرار دخول.",
                "لا تسلّم رمز التحقق لمن يعدّك بتسريع النتيجة. الرمز يفتح جلسة لمن أدخله. في استرجاع انستا نرفض استلام الرمز وكلمة المرور. القرار النهائي يبقى عند ميتا داخل المسار الرسمي على التطبيق أو instagram.com.",
                "رتّب البريد غير الهام وابحث عن رسائل إنستغرام أو الأمان مرة واحدة يومياً بهدوء. افتح الروابط من صندوقك بعد التحقق من النطاق حتى لا تقع على صفحات تصيّد تنتشر مع كلمات الاسترجاع.",
            ],
        },
        {
            "heading": "متى تراجع الإعدادات بعد أي تقدم؟",
            "paragraphs": [
                "إذا عاد جزء من الدخول أو الظهور فراجع الجلسات ووسائل الاتصال في مركز الحسابات في اليوم نفسه. تأجيل الحماية يعيد المشكلة في الليلة التالية. أضف بريداً ثانياً تصل إليه إن أمكن.",
                f"لا تخلط بين مسار «{title}» وبين وعود الفتح مقابل تحويل. مراجع ميتا لا يرى إيصال الدفع دليلاً على الملكية. ابقَ على النموذج الرسمي بعد قراءة الرسالة.",
                "إن التبست عليك الشاشة بعد تقدم جزئي فالتقط لقطة جديدة وأوقف التجارب العشوائية. التشخيص من الصورة أوفر من عشر روابط جاهزة في التعليقات.",
            ],
        },
    ]

    pad_i = 0
    existing = {s.get("heading") for s in a["sections"]}
    while gen.count_article(a) < 900 and pad_i < len(pads):
        pad = pads[pad_i]
        pad_i += 1
        if pad["heading"] in existing:
            continue
        a["sections"].append(pad)
        existing.add(pad["heading"])
        while gen.count_article(a) > 1100 and a["sections"][-1]["paragraphs"]:
            a["sections"][-1]["paragraphs"].pop()
        if not a["sections"][-1]["paragraphs"]:
            a["sections"].pop()
            break

    # fine-tune: if still short, append one paragraph to last section
    while gen.count_article(a) < 900:
        a["sections"][-1]["paragraphs"].append(
            "وثّق أي رد يصل من المنصة بجانب اللقطة الأولى، وابقَ على صياغة وقائع واحدة بلا كلمة مرور في المرفقات. في استرجاع انستا نقرأ المستجد من الصورة فقط، والقرار يبقى لميتا."
        )
        if gen.count_article(a) > 1100:
            a["sections"][-1]["paragraphs"].pop()
            break

    return a


def main() -> None:
    assert len(EXTRAS) == 17, len(EXTRAS)
    articles = [clamp(expand(a)) for a in gen.ARTICLES]
    counts = [gen.count_article(a) for a in articles]
    for i, (a, c) in enumerate(zip(articles, counts), 53):
        flag = " OK" if 900 <= c <= 1100 else " !!"
        print(f"{i:02d} {a['slug']}: {c} words{flag}")
    body = ",\n".join(gen.article_ts(a) for a in articles)
    text = (
        'import { make, type Article } from "./types";\n\n'
        'const published = { date: "2026-09-26", updated: "2026-09-26" };\n\n'
        "export const plannerArticlesD: Article[] = [\n"
        f"{body},\n"
        "];\n"
    )
    gen.OUT.write_text(text, encoding="utf-8")
    print("wrote", gen.OUT)
    print("min", min(counts), "max", max(counts))
    print(
        "below900",
        sum(1 for c in counts if c < 900),
        "above1100",
        sum(1 for c in counts if c > 1100),
    )
    assert all(900 <= c <= 1100 for c in counts), counts


if __name__ == "__main__":
    main()
