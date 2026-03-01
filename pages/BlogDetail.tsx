
import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { Section, ScrollReveal, GlitchText, Button } from '../components/UI';
import { getBlogPosts, BlogPostData } from '../lib/blog';
import { ArrowLeft, Clock, Tag, Share2, Terminal, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const BlogDetail: React.FC = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const [post, setPost] = useState<BlogPostData | null | undefined>(undefined);
  const [nextPost, setNextPost] = useState<BlogPostData | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostData[]>([]);

  useEffect(() => {
    getBlogPosts().then(posts => {
      const currentIndex = posts.findIndex(p => p.id === blogId);
      const found = currentIndex !== -1 ? posts[currentIndex] : null;
      setPost(found);

      if (found) {
        // Next post logic (wrapping around if necessary)
        const next = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : posts[0];
        setNextPost(next !== found ? next : null); // Don't show next if it's the only post

        // Related posts logic (same category, excluding current)
        const related = posts.filter(p => p.category === found.category && p.id !== found.id).slice(0, 3);
        setRelatedPosts(related);
      }
    });

    window.scrollTo(0, 0);
  }, [blogId]);

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (post === undefined) {
    return (
      <Section theme="light" className="pt-32 min-h-screen flex flex-col items-center justify-center text-center">
        <Loader2 size={40} className="animate-spin text-neutral-300 mb-4" />
        <p className="text-neutral-400 font-mono text-xs uppercase tracking-widest">Loading Transmission...</p>
      </Section>
    );
  }

  if (!post) {
    return (
      <Section theme="light" className="pt-32 min-h-screen flex flex-col items-center justify-center text-center">
        <div className="bg-red-50 p-6 rounded-full mb-6">
          <Terminal size={48} className="text-red-500" />
        </div>
        <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter text-black">TRANSMISSION_LOST</h1>
        <p className="text-neutral-500 mb-8 font-mono">The requested data packet could not be retrieved from the archives.</p>
        <NavLink to="/blog">
          <Button variant="primary">Return to Blog</Button>
        </NavLink>
      </Section>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | The 404 Society Blog</title>
        <meta name="description" content={post.content ? post.content.substring(0, 150) + '...' : 'Read this transmission from The 404 Society.'} />
        <meta property="og:title" content={post.title} />
        <meta property="og:image" content={post.image} />
        <meta property="og:type" content="article" />
      </Helmet>
      {/* Full-width Rectangular Banner */}
      <div className="relative w-full h-48 md:h-[400px] 2xl:h-[500px] overflow-hidden bg-black flex items-center justify-center group">
        <img
          src={post.image || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"}
          alt={post.title}
          className="w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-105"
          loading="lazy"
        />

        {/* Subtle Gradient Overlay for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

      </div>

      <Section theme="light" className="!pt-8 md:!pt-12 !pb-32 min-h-screen relative">
        <div className="max-w-4xl mx-auto px-6">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 md:mb-8">
            <ScrollReveal delay={0.05}>
              <NavLink to="/blog" className="inline-flex items-center gap-2 text-black hover:text-neutral-500 transition-all font-mono text-xs uppercase tracking-widest group/btn w-fit">
                <ArrowLeft size={14} className="group-hover/btn:-translate-x-1 transition-transform" />
                <span>Back to Signal Feed</span>
              </NavLink>
            </ScrollReveal>

            {/* Metadata Pill (Date, Category, Share) */}
            <ScrollReveal delay={0.1}>
              <div className="inline-flex items-center bg-black/5 backdrop-blur-xl border border-black/10 rounded-full text-black font-mono text-[10px] sm:text-xs uppercase tracking-widest font-bold overflow-hidden transition-all hover:bg-black/10 hover:border-black/20">

                <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 border-r border-black/10">
                  <Clock size={14} className="text-neutral-500 shrink-0" />
                  <span className="whitespace-nowrap">{post.date}</span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 border-r border-black/10">
                  <Tag size={14} className="text-neutral-500 shrink-0" />
                  <span className="whitespace-nowrap">{post.category}</span>
                </div>

                <button onClick={handleShare} className="flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 hover:bg-black/5 transition-colors shrink-0 text-black" title="Share Transmission">
                  <Share2 size={14} className="sm:w-4 sm:h-4 text-black" />
                </button>

              </div>
            </ScrollReveal>
          </div>

          {/* Title */}
          <ScrollReveal delay={0.1}>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter mb-10 uppercase leading-[0.95] text-black text-left">
              {post.title}
            </h1>
          </ScrollReveal>

          {/* Content */}
          <ScrollReveal delay={0.2} className="prose prose-xl md:prose-2xl prose-neutral max-w-none text-left">
            <div
              className="text-neutral-800 text-xl md:text-2xl leading-relaxed space-y-8 font-medium font-sans"
              dangerouslySetInnerHTML={{ __html: post.content?.replace(/\n/g, '<br/>') || "" }}
            />
          </ScrollReveal>

          {/* Author Block */}
          {post.authorName && (
            <ScrollReveal delay={0.3} className="mt-16 pt-8 border-t border-black/10 flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center font-black text-2xl text-neutral-500 uppercase">
                {post.authorName.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-mono tracking-widest text-neutral-500 uppercase mb-1">Written By</h4>
                <p className="font-bold text-xl uppercase tracking-tight">{post.authorName}</p>
                <p className="text-sm text-neutral-600 font-medium">Core Member, The 404 Society</p>
              </div>
            </ScrollReveal>
          )}

          {/* Footer Navigation (Next Post) */}
          <ScrollReveal delay={0.4} className="mt-12 pt-12 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-8 mb-24">
            <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              End of Transmission // Seq_Ref: {post.id}
            </div>

            {nextPost ? (
              <NavLink to={`/blog/${nextPost.id}`}>
                <Button variant="outline" className="text-xs group flex items-center gap-2">
                  Next: {nextPost.title.substring(0, 20)}... <ArrowLeft size={14} className="rotate-180 transition-transform group-hover:translate-x-1" />
                </Button>
              </NavLink>
            ) : (
              <NavLink to="/blog">
                <Button variant="outline" className="text-xs">Return to Feed</Button>
              </NavLink>
            )}
          </ScrollReveal>

          {/* Related Posts Section */}
          {relatedPosts.length > 0 && (
            <ScrollReveal delay={0.5} className="mb-32">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 border-l-4 border-black pl-4">Related Transmissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map(related => (
                  <NavLink key={related.id} to={`/blog/${related.id}`} className="group block">
                    <div className="aspect-video w-full bg-neutral-100 overflow-hidden relative mb-4">
                      <img
                        src={related.image || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"}
                        alt={related.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500 block mb-2">{related.category}</span>
                    <h4 className="font-bold text-lg leading-tight group-hover:underline decoration-2 underline-offset-4">{related.title}</h4>
                  </NavLink>
                ))}
              </div>
            </ScrollReveal>
          )}

        </div >
      </Section >
    </>
  );
};

export default BlogDetail;
