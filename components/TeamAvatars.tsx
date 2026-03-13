import React, { useState } from 'react';
import { motion } from 'framer-motion';

import bhuvanPhoto from '../bhuvan n.png';
import hrishikeshPhoto from '../K hrishikesh.jpeg';
import yashPhoto from '../Yash.jpeg';
import rudreshPhoto from '../rudresh j.jpeg';
import pramathPhoto from '../Pramath.jpeg';
import deepakPhoto from '../K Deepak.jpeg';

const TEAM = [
    { id: 1, name: 'Bhuvan N',           role: 'Founder & President',         image: bhuvanPhoto,     fallback: 'BN' },
    { id: 2, name: 'K Hrishikesh',       role: 'Co-Founder & Vice President', image: hrishikeshPhoto, fallback: 'KH' },
    { id: 3, name: 'Yashwardhan Kumarr', role: 'COO',                        image: yashPhoto,       fallback: 'YK' },
    { id: 4, name: 'Rudresh J',          role: 'CCO',                        image: rudreshPhoto,    fallback: 'RJ' },
    { id: 5, name: 'Pramath',            role: 'CINO',                       image: pramathPhoto,    fallback: 'PR' },
    { id: 6, name: 'Deepak',             role: 'CTO',                        image: deepakPhoto,     fallback: 'DK' },
];

const SIZE    = 96;
const OVERLAP = 24;

type AvatarProps = { member: typeof TEAM[0]; index: number; total: number };

function Avatar({ member, index, total }: AvatarProps) {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, type: 'spring', stiffness: 500, damping: 20 }}
            style={{
                position: 'absolute',
                left:     `${index * (SIZE - OVERLAP)}px`,
                top:      0,
                width:    `${SIZE}px`,
                height:   `${SIZE}px`,
                zIndex:   hovered ? total + 10 : total - index,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <motion.div
                animate={{ y: hovered ? -14 : 0, scale: hovered ? 1.12 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                style={{ width: '100%', height: '100%', position: 'relative' }}
            >
                <div style={{
                    width: `${SIZE}px`, height: `${SIZE}px`,
                    borderRadius: '50%',
                    border: '4px solid #fff',
                    overflow: 'hidden',
                    background: '#111',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: hovered ? '0 16px 40px rgba(0,0,0,0.25)' : '0 2px 10px rgba(0,0,0,0.12)',
                    transition: 'box-shadow 0.2s',
                    position: 'relative',
                }}>
                    {member.image && (
                        <img
                            src={member.image}
                            alt={member.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, zIndex: 1 }}
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                        />
                    )}
                    <span style={{
                        color: '#fff', fontSize: `${SIZE * 0.3}px`, fontWeight: 700,
                        fontFamily: "'Manrope', sans-serif",
                    }}>
                        {member.fallback}
                    </span>
                </div>

                {hovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15 }}
                        style={{
                            position: 'absolute',
                            bottom: `${SIZE + 12}px`,
                            left: '50%', transform: 'translateX(-50%)',
                            background: '#000', color: '#fff',
                            padding: '7px 14px', borderRadius: '7px',
                            whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 999,
                            fontFamily: "'Manrope', sans-serif",
                        }}
                    >
                        <p style={{ fontSize: '13px', fontWeight: 700, margin: 0 }}>{member.name}</p>
                        <p style={{ fontSize: '11px', opacity: 0.6, margin: 0 }}>{member.role}</p>
                        <div style={{
                            position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                            width: 0, height: 0,
                            borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
                            borderTop: '5px solid #000',
                        }} />
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
}

export default function TeamAvatars() {
    const groupWidth = TEAM.length * (SIZE - OVERLAP) + OVERLAP;

    return (
        <section
            className="bg-white border-t border-neutral-100"
            style={{ fontFamily: "'Manrope', sans-serif", padding: '80px 24px' }}
        >
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-10">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-[#4F46E5] mb-3 flex items-center justify-center gap-2">
                        <span className="w-6 h-[2px] bg-[#4F46E5] inline-block" />
                        The Team
                        <span className="w-6 h-[2px] bg-[#4F46E5] inline-block" />
                    </p>
                    <h2 className="font-black text-black leading-tight" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}>
                        People behind the commits.
                    </h2>
                    <p className="text-neutral-400 mt-3 text-base max-w-lg mx-auto">
                        The core team building PESITM's most vibrant student tech community.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    style={{ position: 'relative', width: `${groupWidth}px`, height: `${SIZE + 20}px` }}
                >
                    {TEAM.map((member, i) => (
                        <Avatar key={member.id} member={member} index={i} total={TEAM.length} />
                    ))}
                </motion.div>

                <p className="text-sm font-semibold text-neutral-400 -mt-4">
                    {TEAM.length} core members &amp; growing
                </p>
            </div>
        </section>
    );
}
