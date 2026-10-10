import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects } from "@/data/portfolio";
import { Navigation } from "@/components/navigation";
import { ProjectVisual } from "@/components/project-visual";
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  return { title: p?.name ?? "Project", description: p?.description };
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const p = projects[index];
  const next = projects[(index + 1) % projects.length];
  return (
    <>
      <Navigation />
      <main id="main" className="case-study section-pad">
        <a href="/#work" className="text-link">
          <ArrowLeft size={16} /> All selected work
        </a>
        <span className="eyebrow case-category">
          PROJECT 0{index + 1} / {p.category}
        </span>
        <h1>
          {p.name}
          <span>.</span>
        </h1>
        <p className="case-summary">{p.summary}</p>
        <ProjectVisual index={index} flow={p.flow} />
        <div className="case-grid">
          <h2>
            The work
            <br />
            <em>behind the screen.</em>
          </h2>
          <div>
            <h3>Context</h3>
            <p>{p.description}</p>
            <h3>My contribution</h3>
            <p>{p.contribution}</p>
            <h3>System overview</h3>
            <p>
              {p.flow.join(" → ")}. This conceptual diagram explains the
              documented workflow; it is not a production architecture
              specification or an application screenshot.
            </p>
            <h3>Technologies & capabilities</h3>
            <div className="stack">
              {p.stack.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <h3>Outcome</h3>
            <p>{p.outcome}</p>
            <a
              className="text-link"
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit live website <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
        <div className="next-project">
          <span className="eyebrow">NEXT PROJECT</span>
          <a href={`/work/${next.slug}`}>
            {next.name}
            <ArrowUpRight />
          </a>
        </div>
      </main>
    </>
  );
}
