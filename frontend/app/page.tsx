import Link from 'next/link';

const trust = ['مالک تایید شده', 'بررسی دستی سند رسمی', 'بررسی کارت ملی', 'کنترل قیمت', 'بدون دلال و بنگاه مشکوک'];

export default function HomePage() {
  return (
    <main className="container">
      <section className="hero">
        <div>
          <span className="badge">Manual-first verification</span>
          <h1>آگهی ملک قابل اعتماد، مستقیم از مالک واقعی</h1>
          <p className="muted">این پلتفرم برای آگهی‌های تمیز، قابل اعتماد و بدون تقلب طراحی شده است. هر آگهی قبل از انتشار توسط ادمین بررسی می‌شود: کارت ملی، سند رسمی، مالکیت، قیمت و رفتار مشکوک.</p>
          <div style={{display:'flex', gap:12, flexWrap:'wrap', marginTop:24}}>
            <Link className="button" href="/submit">ثبت ملک</Link>
            <Link className="button secondary" href="/listings">مشاهده آگهی‌ها</Link>
          </div>
        </div>
        <div className="card success">
          <h2>چرا متفاوت است؟</h2>
          {trust.map(item => <span className="badge" key={item}>{item}</span>)}
          <p className="muted">در نسخه اول هیچ AI اجازه تایید یا رد خودکار ندارد. در آینده AI فقط به ادمین کمک می‌کند تا مغایرت‌ها را سریع‌تر ببیند.</p>
        </div>
      </section>
      <section className="grid">
        <div className="card"><h3>برای مالک</h3><p className="muted">ثبت ملک همراه با سند رسمی، کارت ملی، موقعیت و شرایط فروش یا اجاره.</p></div>
        <div className="card"><h3>برای خریدار/مستاجر</h3><p className="muted">مشاهده آگهی‌های تایید شده و تماس فقط پس از احراز موبایل.</p></div>
        <div className="card"><h3>برای ادمین</h3><p className="muted">صف بررسی دستی، تصمیم شفاف، دلیل رد، ریسک قیمت و نشانه‌های دلالی.</p></div>
      </section>
    </main>
  );
}
