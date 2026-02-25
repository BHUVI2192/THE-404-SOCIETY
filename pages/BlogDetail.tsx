
import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { Section, ScrollReveal, GlitchText, Button } from '../components/UI';
import { getBlogPosts, BlogPostData } from '../lib/blog';
import { ArrowLeft, Clock, Tag, Share2, Terminal, Loader2 } from 'lucide-react';

const BlogDetail: React.FC = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const [post, setPost] = useState<BlogPostData | null | undefined>(undefined); // undefined=loading, null=not found

  useEffect(() => {
    getBlogPosts().then(posts => {
      const found = posts.find(p => p.id === blogId);
      setPost(found || null);
    });
  }, [blogId]);

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
      {/* Full-width Rectangular Banner */}
      <div className="relative w-full h-48 md:h-[400px] 2xl:h-[500px] overflow-hidden bg-black flex items-center justify-center group">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-105" loading="lazy" />

        {/* Subtle Gradient Overlay for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

        {/* Back Button Overlay */}
        <NavLink to="/blog" className="absolute top-6 left-4 md:top-8 md:left-8 flex items-center gap-2 !text-white hover:text-white transition-all font-mono text-xs uppercase tracking-widest bg-black hover:bg-neutral-900 border border-white/10 px-6 py-3 rounded-lg shadow-2xl z-10 group/btn">
          <ArrowLeft size={14} className="group-hover/btn:-translate-x-1 transition-transform !text-white" />
          <span className="!text-white">Back to Signal Feed</span>
        </NavLink>

        {/* Metadata Overlay (Date, Category, Share) */}
        <div className="absolute bottom-6 right-4 md:bottom-8 md:right-8 flex flex-wrap items-center gap-4 bg-black border border-white/10 px-6 py-3 rounded-lg shadow-2xl z-10">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-white" />
            <span className="text-xs font-mono text-white uppercase font-bold tracking-wider">{post.date}</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/20"></div>
          <div className="flex items-center gap-2">
            <Tag size={14} className="text-white" />
            <span className="text-xs font-mono text-white uppercase border border-white/30 px-2.5 py-1 rounded-sm font-bold bg-white/10">{post.category}</span>
          </div>
          <div className="w-px h-4 bg-white/20"></div>
          <button className="text-white hover:text-neutral-300 transition-colors" title="Share Transmission">
            <Share2 size={16} />
          </button>
        </div>
      </div>

      <Section theme="light" className="!pt-12 md:!pt-20 !pb-32 min-h-screen relative">
        <div className="max-w-4xl mx-auto px-6">
          {/* Title */}
          <ScrollReveal delay={0.1}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-10 uppercase leading-[0.95] text-black text-left">
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

          {/* Footer Navigation */}
          <ScrollReveal delay={0.4} className="mt-20 pt-12 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-8 mb-24">
            <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              End of Transmission // Seq_Ref: {post.id}
            </div>
            <NavLink to="/blog">
              <Button variant="outline" className="text-xs">Next Transmission</Button>
            </NavLink>
          </ScrollReveal>
        </div>
      </Section>
    </>
  );
};

export default BlogDetail;
