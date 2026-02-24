
import React from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { Section, ScrollReveal, GlitchText, Button } from '../components/UI';
import { POSTS } from '../constants';
import { ArrowLeft, Clock, Tag, Share2 } from 'lucide-react';

const BlogDetail: React.FC = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const post = POSTS.find(p => p.id === blogId);

  if (!post) {
    return (
      <Section theme="dark" className="pt-32 min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-black mb-4 uppercase">TRANSMISSION_LOST</h1>
        <p className="text-neutral-500 mb-8">The requested data packet could not be retrieved from the archives.</p>
        <NavLink to="/blog">
          <Button variant="primary">Return to Blog</Button>
        </NavLink>
      </Section>
    );
  }

  return (
    <Section theme="dark" className="pt-32 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <ScrollReveal>
          <NavLink to="/blog" className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-12 font-mono text-xs uppercase tracking-widest group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Archives
          </NavLink>
        </ScrollReveal>

        {/* Header Metadata */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap items-center gap-6 mb-8 border-b border-neutral-900 pb-8">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-neutral-500" />
              <span className="text-xs font-mono text-neutral-400 uppercase">{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-neutral-500" />
              <span className="text-xs font-mono text-white uppercase border border-neutral-800 px-2 py-0.5">{post.category}</span>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <button className="text-neutral-500 hover:text-white transition-colors" title="Share Transmission">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Title */}
        <ScrollReveal delay={0.2}>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-12 uppercase leading-none">
            <GlitchText text={post.title} />
          </h1>
        </ScrollReveal>

        {/* Content */}
        <ScrollReveal delay={0.3} className="prose prose-invert prose-neutral max-w-none">
          <div className="text-neutral-300 text-lg leading-relaxed space-y-8 font-light">
            {post.content?.split('\n').map((paragraph, i) => (
              paragraph.trim() && <p key={i}>{paragraph.trim()}</p>
            ))}
          </div>
        </ScrollReveal>

        {/* Footer Navigation */}
        <ScrollReveal delay={0.4} className="mt-20 pt-12 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="text-[10px] font-mono text-neutral-600 uppercase tracking-[0.2em]">
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
