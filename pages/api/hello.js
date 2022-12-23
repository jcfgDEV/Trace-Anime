
export default function handler(NextApiRequest, NextApiResponse) {
  NextApiResponse.status(200).json({ name: 'John Doe' })
}