import { SEO_CONTENT } from '@/data/content';

export default function SeoContent() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-rose-600 font-semibold text-sm uppercase tracking-wider">
            Informações e guias
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mt-2 text-balance">
            Tudo sobre renda extra, vaga home office e trabalho com webcam
          </h2>
        </div>

        <div className="space-y-12">
          {SEO_CONTENT.map((section, i) => (
            <article key={i}>
              <h3 className="text-xl sm:text-2xl font-bold text-ink-900 mb-4">
                {section.heading}
              </h3>
              {section.paragraphs.map((p, j) => (
                <p key={j} className="text-ink-600 leading-relaxed mb-3">
                  {p}
                </p>
              ))}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
