import { useRouter } from "next/router";
import Link from "next/link";

export default function Breadcrumbs() {
  const router = useRouter();
  const { pathname } = router;
  const segments = pathname.split("/").filter((segment) => segment !== "");
  if (["/", "/register"].includes(pathname)) return "";

  return (
    <main className="bg-white py-4 sticky w-full max-w-7xl px-16 max-md:px-6">
      <div className="flex gap-2 px-2">
        {segments.map((segment, index) => {
          const currentSegment = segment === "[id]" ? "Chats" : segment;

          const segmentPath = `/${segments.slice(0, index + 1).join("/")}`;
          const capitalizedSegment =
            currentSegment.charAt(0).toUpperCase() + currentSegment.slice(1);

          return (
            <div key={segmentPath}>
              <Link
                href={segmentPath}
                className={
                  index === 0 ? "text-black text-sm" : " text-blue text-sm"
                }
              >
                {capitalizedSegment} {">"}
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
