

import { endABTest } from "@/app/action/ab-testing-action"


export async function POST(request: Request) {
  try {
    const { linkId, applyWinner } = await request.json()
    await endABTest(linkId, applyWinner)
    return Response.json({ success: true })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 400 })
  }
}