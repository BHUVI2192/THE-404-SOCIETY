import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getBlogPosts, BlogPostData } from "../lib/blog";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Helmet } from 'react-helmet-async';

// --- CONFIGURATION ---
const CONFIG = {
  fontPrimary: "'Manrope', sans-serif",
  fontMono: "'Space Mono', monospace",
};

export default function BlogPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    getBlogPosts().then(data => { setPosts(data); setLoading(false); });
  }, []);

  const categories = ["All", ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];

  const filteredPosts = selectedCategory === "All"
    ? posts
    : posts.filter(p => p.category === selectedCategory);

  return (
    <>
      <Helmet>
        <title>Blog & Transmissions | The 404 Society</title>
        <meta name="description" content="Tech insights, coding tutorials, and developer stories from The 404 Society at PESITM Shivamogga." />
      </Helmet>
      <div style={{ fontFamily: CONFIG.fontPrimary, backgroundColor: "#fff", minHeight: "100vh" }}>
        <style>
          {`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;800&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
          ::selection { background: #000; color: #fff; }
          body { margin: 0; }
        
          /* DEFAULT (DESKTOP) STYLES */
          .blog-grid {
             display: grid;
             grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
             grid-auto-rows: 350px;
             gap: 20px;
             padding: 5vh 5vw;
          }
          .blog-card {
             border-radius: 16px;
          }

          /* MOBILE (INSTAGRAM EXPLORE STYLE) */
          @media (max-width: 768px) {
             .blog-grid {
                grid-template-columns: repeat(3, 1fr) !important;
                grid-auto-rows: 33vw !important;
                gap: 2px !important;
                padding: 0 !important;
             }
             .blog-card {
                grid-column: span 1 !important;
                grid-row: span 1 !important;
                border-radius: 0 !important;
             }
             .blog-card-content {
                display: none !important;
             }
             .blog-header {
                padding: 80px 20px 20px 20px !important;
             }
             .huge-title {
                font-size: 3rem !important;
             }
          }
        `}
        </style>

        {/* --- HEADER --- */}
        <div className="blog-header" style={{ paddingTop: "120px", paddingBottom: "40px", paddingLeft: "5vw", paddingRight: "5vw" }}>
          <h1 className="huge-title" style={styles.hugeTitle}>TRANSMISSIONS</h1>
          <p style={styles.subtitle}>
            Tech insights, coding tutorials &amp; developer stories from PESITM Shivamogga.
          </p>

          {!loading && categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as string)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border
                    ${selectedCategory === cat
                      ? 'bg-black text-white border-black'
                      : 'bg-transparent text-gray-500 border-gray-200 hover:border-black hover:text-black'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- THE BENTO GRID --- */}
        <section className="blog-grid">
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#999', fontSize: '0.85rem' }}>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Loading posts...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div style={{ gridColumn: '1/-1', padding: '60px', textAlign: 'center', color: '#ccc', fontFamily: CONFIG.fontMono, fontSize: '0.8rem' }}>
              NO TRANSMISSIONS FOUND IN THIS CATEGORY.
            </div>
          ) : (
            filteredPosts.map((article) => (
              <BentoCard key={article.id} article={article} onClick={() => navigate(`/blog/${article.id}`)} />
            ))
          )}
        </section>


      </div>
    </>
  );
}

// --- SUB-COMPONENT: BENTO CARD ---
const BentoCard: React.FC<{ article: BlogPostData; onClick: () => void }> = ({ article, onClick }) => {
  return (
    <motion.div
      className="blog-card"
      style={{
        ...styles.card,
        // Inline styles still apply on desktop, CSS !important overrides on mobile
        gridColumn: `span ${article.colSpan || 1}`,
        gridRow: `span ${article.rowSpan || 1}`,
        willChange: "transform",
      }}
      initial="rest"
      whileHover="hover"
      animate="rest"
      onClick={onClick}
    >
      {/* 1. BACKGROUND IMAGE (Zooms on hover) */}
      <div style={styles.imageWrapper}>
        <motion.img
          src={article.image || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"}
          loading="lazy"
          alt={article.title}
          style={styles.cardImage}
          variants={{
            rest: { scale: 1 },
            hover: { scale: 1.05 }
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        {/* Noise Texture for Premium Feel */}
        <div style={styles.noiseOverlay} />
        {/* Gradient for Text Readability */}
        <div style={styles.gradientOverlay} />
      </div>

      {/* 2. CARD CONTENT (Bottom Aligned) */}
      <motion.div
        className="blog-card-content"
        style={styles.cardContent}
        variants={{
          rest: { y: 0 },
          hover: { y: -10 } // Lifts up slightly
        }}
        transition={{ duration: 0.4 }}
      >
        {/* Top Meta */}
        <div style={styles.metaRow}>
          <span style={styles.categoryBadge}>{article.category || 'TRANSMISSION'}</span>
          <span style={styles.dateText}>{article.date}</span>
          {article.readTime && (
            <>
              <span style={{ opacity: 0.5 }}>•</span>
              <span style={styles.dateText}>{article.readTime}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          ...styles.cardTitle,
          fontSize: (article.colSpan || 1) > 1 ? "clamp(1.5rem, 2vw, 2.5rem)" : "1.5rem" // Dynamic font size based on size
        }}>
          {article.title}
        </h3>

        {/* Author Line */}
        {article.authorName && (
          <div style={{ marginTop: '10px', fontSize: '0.85rem', opacity: 0.8, fontFamily: CONFIG.fontMono }}>
            BY {article.authorName.toUpperCase()}
          </div>
        )}

        {/* Read More Arrow (Only visible on hover) */}
        <motion.div
          style={styles.readMore}
          variants={{
            rest: { opacity: 0, y: 10 },
            hover: { opacity: 1, y: 0 }
          }}
        >
          READ ARTICLE &rarr;
        </motion.div>

      </motion.div>
    </motion.div>
  );
};

// Footer removed as per user request
// <footer style={styles.footer}>
//   <div style={styles.footerContent}>
//     <h3></h3>
//     <p></p>
//   </div>
// </footer>

// --- STYLES ---
const styles: { [key: string]: React.CSSProperties } = {
  header: { padding: "12vh 5vw 5vh 5vw", borderBottom: "1px solid #eee" },
  headerTop: { marginBottom: "20px" },
  brand: { fontFamily: CONFIG.fontMono, fontSize: "0.75rem", fontWeight: 700, border: "1px solid #eee", padding: "8px 16px", borderRadius: "4px", backgroundColor: "#fafafa" },
  hugeTitle: { fontSize: "clamp(4rem, 11vw, 9rem)", fontWeight: 800, lineHeight: 0.9, margin: 0, letterSpacing: "-0.04em", color: "#000" },
  subtitle: { fontFamily: CONFIG.fontMono, fontSize: "0.9rem", maxWidth: "500px", marginTop: "30px", opacity: 0.6 },

  // BENTO GRID LAYOUT
  gridContainer: {
    display: "grid",
    // Responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    // Auto rows with a base height of 350px
    gridAutoRows: "350px",
    gap: "20px",
    padding: "5vh 5vw"
  },

  // CARD STYLES
  card: {
    position: "relative",
    borderRadius: "16px", // Soft corners like Apple/Linear
    overflow: "hidden",
    cursor: "pointer",
    backgroundColor: "#f0f0f0" // Loading state color
  },
  imageWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 0
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  noiseOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')",
    opacity: 0.2,
    pointerEvents: "none"
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)",
    zIndex: 1
  },

  // CONTENT
  cardContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    padding: "30px",
    zIndex: 2,
    color: "#fff",
    boxSizing: "border-box"
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "15px"
  },
  categoryBadge: {
    fontFamily: CONFIG.fontMono,
    fontSize: "0.7rem",
    fontWeight: 700,
    backgroundColor: "#fff",
    color: "#000",
    padding: "4px 8px",
    borderRadius: "4px"
  },
  dateText: {
    fontFamily: CONFIG.fontMono,
    fontSize: "0.8rem",
    opacity: 0.8
  },
  cardTitle: {
    fontWeight: 800,
    lineHeight: 1.1,
    margin: 0,
    letterSpacing: "-0.02em"
  },
  readMore: {
    fontFamily: CONFIG.fontMono,
    fontSize: "0.8rem",
    fontWeight: 700,
    marginTop: "20px",
    color: "#fff", // or an accent color
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },



  footer: { padding: "50px 5vw", borderTop: "1px solid #eee", backgroundColor: "#fff" },
  footerContent: { textAlign: "center" }
};
