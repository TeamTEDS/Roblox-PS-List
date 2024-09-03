// pages/api/links.js
import dbConnect from '../../lib/mongodb';
import Link from '../../models/Link';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'POST':
      try {
        const link = await Link.create(req.body);
        res.status(201).json({ success: true, data: link });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'GET':
      try {
        const links = await Link.find({});
        res.status(200).json({ success: true, data: links });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}