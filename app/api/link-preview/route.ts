import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { url } = await request.json()

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  try {
    const response = await fetch('https://api.linkpreview.net', {
      method: 'POST',
      headers: {
        'X-Linkpreview-Api-Key': process.env.LINKPREVIEW_API_KEY || '',
      },
      body: JSON.stringify({ q: url }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch link preview')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching link preview:', error)
    return NextResponse.json({ error: 'Failed to fetch link preview' }, { status: 500 })
  }
}