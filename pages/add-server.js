// pages/add-server.js
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function AddServerPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    url: '',
    imageUrl: '',
    name: '',
    category: '',
  });
  const [message, setMessage] = useState('');
  const [links, setLinks] = useState([]);
  const [editingLink, setEditingLink] = useState(null);

  // Fetch links from the server
  const fetchLinks = async () => {
    const res = await fetch('/api/links');
    const data = await res.json();
    if (data.success) {
      setLinks(data.data);
    } else {
      console.error('Failed to fetch links');
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission for adding or updating a link
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (authenticated) {
      setMessage(''); // Clear any previous messages

      try {
        const method = editingLink ? 'PUT' : 'POST';
        const url = editingLink ? `/api/links/${editingLink._id}` : '/api/links';
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.success) {
          setMessage(editingLink ? 'Link updated successfully!' : 'Link added successfully!');
          setFormData({
            url: '',
            imageUrl: '',
            name: '',
            category: '',
          });
          setEditingLink(null);
          fetchLinks();
        } else {
          setMessage('Failed to save link.');
        }
      } catch (error) {
        setMessage('An error occurred. Please try again.');
        console.error('Error submitting form:', error);
      }
    } else {
      setMessage('You need to be authenticated to submit the form.');
    }
  };

  // Handle form submission for authentication
  const handleSubmitPassword = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const res = await fetch('/api/authenticate', {
      headers: {
        'Authorization': `Bearer ${password}`,
      },
    });

    if (res.ok) {
      setAuthenticated(true);
      setError('');
    } else {
      setAuthenticated(false);
      setError('Invalid password. Please try again.');
    }
  };

  // Handle editing a link
  const handleEdit = (link) => {
    setEditingLink(link);
    setFormData({
      url: link.url,
      imageUrl: link.imageUrl,
      name: link.name,
      category: link.category,
    });
  };

  // Handle deleting a link
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this link?')) {
      try {
        const response = await fetch(`/api/links/${id}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          setMessage('Link deleted successfully!');
          fetchLinks();
        } else {
          setMessage('Failed to delete link.');
        }
      } catch (error) {
        setMessage('An error occurred. Please try again.');
        console.error('Error deleting link:', error);
      }
    }
  };

  // Display password form if not authenticated
  if (!authenticated) {
    return (
      <div className="container">
        <Head>
          <title>TEDS Roblox Private Server List - Authentication</title>
        </Head>
        <h1 className="title">TEDS Roblox Private Server List</h1>
        <h2>Authentication Required</h2>
        <form onSubmit={handleSubmitPassword} className="form">
          <div className="inputGroup">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submitButton">
            Submit
          </button>
          {error && <p className="message">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="container">
      <Head>
        <title>TEDS Roblox Private Server List - Manage Servers</title>
      </Head>
      <h1 className="title">TEDS Roblox Private Server List</h1>
      <h2>{editingLink ? 'Edit Link' : 'Add a New Link'}</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="inputGroup">
          <label htmlFor="url">Link URL:</label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            required
          />
        </div>

        <div className="inputGroup">
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
          />
        </div>

        <div className="inputGroup">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="inputGroup">
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submitButton">
          {editingLink ? 'Update Link' : 'Add Link'}
        </button>

        {message && <p className="message">{message}</p>}
      </form>

      <h2>Existing Links</h2>
      <ul className="linksList">
        {links.map(link => (
          <li key={link._id} className="linkItem">
            <div className="linkItemContent">
              <img src={link.imageUrl} alt={link.name} className="linkImage" />
              <div className="linkItemText">
                <h3>{link.name}</h3>
                <p>{link.category}</p>
              </div>
            </div>
            <div className="buttonContainer">
              <button onClick={() => handleEdit(link)} className="editButton">
                Edit
              </button>
              <button onClick={() => handleDelete(link._id)} className="deleteButton">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
