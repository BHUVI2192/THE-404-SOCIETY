
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
    <Section theme="light" className="pt-32 min-h-screen relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-neutral-100">
        <div className="h-full bg-accent-purple w-1/3"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Navigation */}
        <ScrollReveal>
          <NavLink to="/blog" className="inline-flex items-center gap-2 text-neutral-500 hover:text-black transition-colors mb-12 font-mono text-xs uppercase tracking-widest group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Signal Feed
          </NavLink>
        </ScrollReveal>

        {/* Header Metadata */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap items-center gap-6 mb-8 border-b border-black/10 pb-8">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-neutral-400" />
              <span className="text-xs font-mono text-neutral-500 uppercase font-bold tracking-wider">{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-neutral-400" />
              <span className="text-xs font-mono text-black uppercase border border-neutral-200 px-2 py-0.5 rounded-sm font-bold bg-neutral-50">{post.category}</span>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <button className="text-neutral-400 hover:text-black transition-colors" title="Share Transmission">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Title */}
        <ScrollReveal delay={0.2}>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-12 uppercase leading-[0.9] text-black">
            {post.title}
          </h1>
        </ScrollReveal>

        {/* Content */}
        <ScrollReveal delay={0.3} className="prose prose-lg prose-neutral max-w-none">
          <div
            className="text-neutral-800 text-xl leading-relaxed space-y-8 font-medium font-sans"
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
  );
};

export default BlogDetail;
