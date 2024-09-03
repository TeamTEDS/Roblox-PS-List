// pages/api/links/[id].js
import dbConnect from '../../../lib/mongodb';
import Link from '../../../models/Link';
export const runtime = 'edge';

dbConnect();

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case 'GET':
      try {
        const link = await Link.findById(id);
        if (!link) return res.status(404).json({ success: false, message: 'Link not found' });
        res.status(200).json({ success: true, data: link });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
      break;
    
    case 'PUT':
      try {
        const link = await Link.findByIdAndUpdate(id, req.body, { new: true });
        if (!link) return res.status(404).json({ success: false, message: 'Link not found' });
        res.status(200).json({ success: true, data: link });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
      break;

    case 'DELETE':
      try {
        const link = await Link.findByIdAndDelete(id);
        if (!link) return res.status(404).json({ success: false, message: 'Link not found' });
        res.status(200).json({ success: true, message: 'Link deleted' });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
