import Image from "next/image";

import { cn, getTechLogos } from "@/lib/utils";

const DisplayTechIcons = async ({ techStack }: TechIconProps) => {
  const techIcons = await getTechLogos(techStack || []);

  if (!techIcons || techIcons.length === 0) {
    return (
      <span className="text-[11px] text-slate-400 font-medium">General Tech</span>
    );
  }

  const visibleIcons = techIcons.slice(0, 3);
  const remainingCount = techIcons.length - 3;

  return (
    <div className="flex items-center" aria-label={`Tech stack: ${techStack?.join(", ")}`}>
      <div className="flex -space-x-2">
        {visibleIcons.map(({ tech, url }) => (
          <div
            key={tech}
            className={cn(
              "relative group size-7 rounded-full bg-[#14141F] border border-white/10 ring-2 ring-[#0F0F1A] flex items-center justify-center transition-transform hover:scale-110 hover:z-20 cursor-default"
            )}
            title={tech}
          >
            <span className="tech-tooltip" role="tooltip">{tech}</span>

            <Image
              src={url}
              alt={tech}
              width={20}
              height={20}
              className="size-3.5 object-contain"
            />
          </div>
        ))}

        {remainingCount > 0 && (
          <div
            className="relative size-7 rounded-full bg-[#1A1A2E] border border-white/10 ring-2 ring-[#0F0F1A] flex items-center justify-center text-[10px] font-bold text-slate-200"
            title={`${remainingCount} more technologies`}
            aria-label={`${remainingCount} more technologies`}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayTechIcons;
