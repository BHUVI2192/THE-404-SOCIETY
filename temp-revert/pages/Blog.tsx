
import React from 'react';
import { Section, Button, ScrollReveal } from '../components/UI';
import { POSTS } from '../constants';
import { NavLink } from 'react-router-dom';

const Blog: React.FC = () => {
  return (
    <Section theme="dark" className="pt-32 min-h-screen">
      <ScrollReveal>
        <h1 className="text-5xl font-black mb-12 tracking-tighter">TRANSMISSIONS</h1>
      </ScrollReveal>
      
      <div className="grid gap-12 max-w-4xl">
        {POSTS.map((post, idx) => (
          <ScrollReveal key={post.id} delay={idx * 0.1} className="border-b border-neutral-800 pb-12 group">
            <article>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-32 pt-2 shrink-0">
                   <span className="text-sm font-mono text-neutral-500 block">{post.date}</span>
                   <span className="text-xs font-mono text-white uppercase border border-neutral-700 px-2 mt-2 inline-block">{post.category}</span>
                </div>
                <div className="flex-1">
                   <NavLink to={`/blog/${post.id}`}>
                     <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-neutral-400 transition-colors cursor-pointer leading-tight">{post.title}</h2>
                   </NavLink>
                   <p className="text-neutral-400 mb-6 leading-relaxed text-lg">
                     {post.excerpt}
                   </p>
                   <NavLink to={`/blog/${post.id}`}>
                     <Button variant="outline" className="text-xs py-2 px-4 group-hover:border-white group-hover:text-white transition-all">Read Transmission</Button>
                   </NavLink>
                </div>
              </div>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </Section>
  );
};

export default Blog;
