

import { startABTest } from "@/app/action/ab-testing-action"


export async function POST(request: Request) {
  try {
    const { linkId, variantBTitle } = await request.json()
    await startABTest(linkId, variantBTitle)
    return Response.json({ success: true })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 400 })
  }
}