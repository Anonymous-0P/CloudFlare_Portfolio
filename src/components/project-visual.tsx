import Image from "next/image";
export function ProjectVisual({
  index,
  flow,
}: {
  index: number;
  flow: string[];
}) {
  if (index === 3)
    return (
      <div className="project-visual merlin-visual">
        <div className="visual-top">
          <span>FIG. 04</span>
          <span>LIVE WEBSITE / CAPTURED OCT 2026</span>
          <span>↗</span>
        </div>
        <div className="browser-frame">
          <div className="browser-bar">
            <i />
            <i />
            <i />
            <span>merlinhydraulics.com</span>
          </div>
          <Image
            src="/merlin-hydraulics.webp"
            alt="Actual Merlin Hydraulics homepage showing industrial equipment and its product navigation"
            width={1200}
            height={833}
            sizes="(max-width: 767px) 88vw, 55vw"
          />
        </div>
        <div className="visual-bottom">
          <span>RESPONSIVE DESIGN / PRODUCTION DEPLOYMENT</span>
        </div>
      </div>
    );
  return (
    <div className={`project-visual visual-${index}`}>
      <div className="visual-top">
        <span>FIG. 0{index + 1}</span>
        <span>CONCEPTUAL SYSTEM DIAGRAM</span>
        <span>↗</span>
      </div>
      <div className="diagram-grid" />
      <div className="system-diagram">
        {flow.map((item, i) => (
          <div className="diagram-node" key={item}>
            <span className="node-index">0{i + 1}</span>
            <div className="node-shape">
              {index === 2 ? "▤" : i === 1 ? "◇" : "○"}
            </div>
            <span>{item}</span>
            {i < flow.length - 1 && (
              <div className="node-connector">
                <i />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="visual-bottom">
        <span>
          {
            [
              "CONNECTED OPERATIONS",
              "ROLE → EVENT → INSIGHT",
              "GENERATE → VERIFY → EXPORT",
            ][index]
          }
        </span>
        <span>PK — SYSTEM STUDIES</span>
      </div>
    </div>
  );
}
