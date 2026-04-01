import { NextResponse, type NextRequest } from "next/server";
import { getEpisodesInRange } from "@/lib/queries/episode-queries";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json({ error: "Missing from/to params" }, { status: 400 });
  }

  try {
    const episodes = await getEpisodesInRange(from, to);
    return NextResponse.json(episodes);
  } catch {
    return NextResponse.json({ error: "Failed to fetch episodes" }, { status: 500 });
  }
}
