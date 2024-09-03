// pages/api/authenticate.js
export const runtime = 'edge';
export default function handler(req, res) {
    const { authorization } = req.headers;
  
    if (!authorization || authorization !== `Bearer ${process.env.PASSWORD}`) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    res.status(200).json({ message: 'Authorized' });
  }