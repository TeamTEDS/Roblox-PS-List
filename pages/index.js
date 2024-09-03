// pages/index.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function HomePage() {
  const [links, setLinks] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/links')
      .then((res) => res.json())  // Ensure response is converted to JSON
      .then((data) => {
        if (Array.isArray(data.data)) {  // Ensure data.data is an array
          setLinks(data.data);
          const uniqueCategories = [...new Set(data.data.map(link => link.category))];
          setCategories(uniqueCategories);
        } else {
          console.error("Data received is not an array:", data);
        }
      })
      .catch(error => console.error("Error fetching data:", error)); // Handle fetch errors
  }, []);

  return (
    <div className="container">
      <h1 className={styles.title}>TEDS Roblox Private Server List</h1>
      {categories.map(category => (
        <div key={category}>
          <h2 className={styles.categoryTitle}>{category}</h2>
          <div className={styles.grid}>
            {links.filter(link => link.category === category).map(link => (
              <a key={link._id} href={link.url} className={styles.card}>
                <img src={link.imageUrl} alt={link.name} className={styles.image} />
                <h3>{link.name}</h3>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}