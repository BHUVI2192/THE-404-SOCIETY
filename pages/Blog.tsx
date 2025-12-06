import React from 'react';
import { Section, Button } from '../components/UI';
import { POSTS } from '../constants';

const Blog: React.FC = () => {
  return (
    <Section theme="dark" className="pt-32 min-h-screen">
      <h1 className="text-5xl font-black mb-12">TRANSMISSIONS</h1>
      
      <div className="grid gap-12 max-w-4xl">
        {POSTS.map((post) => (
          <article key={post.id} className="border-b border-neutral-800 pb-12 group">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-32 pt-2">
                 <span className="text-sm font-mono text-neutral-500 block">{post.date}</span>
                 <span className="text-xs font-mono text-white uppercase border border-neutral-700 px-2 mt-2 inline-block">{post.category}</span>
              </div>
              <div className="flex-1">
                 <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-neutral-400 transition-colors cursor-pointer">{post.title}</h2>
                 <p className="text-neutral-400 mb-6 leading-relaxed text-lg">
                   {post.excerpt}
                 </p>
                 <Button variant="outline" className="text-xs py-2 px-4">Read Transmission</Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
};

export default Blog;