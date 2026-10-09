# موقع موازنة المحاسبي — mowaznah.com

صفحة تعريفية (Landing Page) لنظام «موازنة المحاسبي» من التقنية العالية HIGHTECH.
موقع ثابت: HTML وCSS وJavaScript فقط، بدون مكتبات ولا خادم، فيعمل على أي استضافة.

## المعاينة في VS Code

1. افتح المجلد في VS Code.
2. ثبّت إضافة **Live Server** (يقترحها VS Code تلقائياً).
3. زر يمين على `index.html` ← **Open with Live Server**. أي تعديل تحفظه يظهر فوراً في المتصفح.

## الملفات

```
index.html                الصفحة كاملة
css/style.css             التصميم (الألوان في :root أعلى الملف)
js/main.js                التفاعل: القائمة، جولة الشاشات، العدّادات، نموذج واتساب
assets/img/               صور الشاشات (WebP)، الشعار، صورة المشاركة og-image.png
assets/fonts/             خط Tajawal مستضاف محلياً
robots.txt, sitemap.xml   لمحركات البحث
og/                       قوالب توليد صورة المشاركة والأيقونة (لا تُرفع للاستضافة)
```

## تعديلات شائعة

- **أرقام التواصل:** ابحث عن `966544234284` و`966500941255` في `index.html` و`js/main.js`.
- **رسالة واتساب الجاهزة:** في `js/main.js` داخل نموذج الطلب.
- **صور الشاشات:** استبدل الملف في `assets/img/` بنفس الاسم (WebP بعرض 1600 بكسل تقريباً).

## الرفع على الدومين mowaznah.com

ارفع **كل محتويات المجلد عدا `og/` و`.vscode/` و`README.md`**.

### الطريقة أ: Netlify (مجاني، HTTPS تلقائي) — الأسهل
1. افتح app.netlify.com/drop واسحب المجلد إليه.
2. Site settings ← Domain management ← Add domain ← `mowaznah.com`.
3. في GoDaddy ← DNS للدومين:
   - سجل **A** باسم `@` يشير إلى `75.2.60.5`
   - سجل **CNAME** باسم `www` يشير إلى `<اسم-موقعك>.netlify.app`
4. بعد انتشار الـ DNS (دقائق إلى ساعات) يفعّل Netlify شهادة HTTPS تلقائياً.

### الطريقة ب: استضافة GoDaddy (إن كانت مشتراة)
cPanel ← File Manager ← `public_html` ← ارفع الملفات، ثم فعّل SSL من cPanel.

### الطريقة ج: سيرفر DigitalOcean الحالي
انسخ الملفات إلى مجلد على السيرفر وقدّمها عبر nginx، ثم شهادة HTTPS بـ certbot،
وفي GoDaddy سجل **A** باسم `@` و`www` يشير إلى عنوان السيرفر.
