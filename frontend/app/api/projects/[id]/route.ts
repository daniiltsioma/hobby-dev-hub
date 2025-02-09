import { projects } from "../route";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = Number((await params).id);
  const project = projects.find((proj) => proj.id === id);

  return Response.json(project);
}
