'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, Variants } from 'framer-motion';

interface TeamMember {
  id: string;
  name: string;
  role: string | null;
  reportsTo?: string;
  isVisible?: boolean;
}

const teamData: TeamMember[] = [
  {
    id: 'anna',
    name: 'Anna Zezulka',
    role: 'Psychology student & Developer',
  },
  {
    id: 'sofia',
    name: 'Sofia Grycová',
    role: 'Psychology student',
    reportsTo: 'anna',
  },
  {
    id: 'natalie',
    name: 'Natálie Neumannová',
    role: 'Psychology student',
    reportsTo: 'anna',
  },
  {
    id: 'spacer',
    name: '',
    role: null,
    reportsTo: 'anna',
    isVisible: false,
  },
  {
    id: 'daniel',
    name: 'Daniel Pravdík',
    role: 'none specified',
    reportsTo: 'spacer',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

interface ConnectionLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function OrgChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [lines, setLines] = useState<ConnectionLine[]>([]);
  const [containerHeight, setContainerHeight] = useState(0);

  const calculateLines = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLines: ConnectionLine[] = [];

    teamData.forEach((member) => {
      if (!member.reportsTo) return;
      const parentEl = nodeRefs.current[member.reportsTo];
      const childEl = nodeRefs.current[member.id];
      if (!parentEl || !childEl) return;

      const parentRect = parentEl.getBoundingClientRect();
      const childRect = childEl.getBoundingClientRect();

      newLines.push({
        x1: parentRect.left + parentRect.width / 2 - containerRect.left,
        y1: parentRect.bottom - containerRect.top,
        x2: childRect.left + childRect.width / 2 - containerRect.left,
        y2: childRect.top - containerRect.top,
      });
    });

    setLines(newLines);
    setContainerHeight(containerRef.current.scrollHeight);
  }, []);

  useEffect(() => {
    // Wait for card animations to settle (stagger 0.2s × 5 cards + 0.5s duration)
    const timer = setTimeout(calculateLines, 700);
    window.addEventListener('resize', calculateLines);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateLines);
    };
  }, [calculateLines]);

  return (
    <div ref={containerRef} className="relative w-full flex flex-col items-center py-12">
      <svg
        className="absolute inset-0 w-full pointer-events-none"
        style={{ height: containerHeight || '100%' }}
        aria-hidden="true"
      >
        {lines.map((line, i) => (
          <motion.line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            className="stroke-border stroke-2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        ))}
      </svg>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-5xl flex flex-col gap-24 z-10"
      >
        {/* Level 1 */}
        <div className="flex justify-center">
          <Node
            member={teamData[0]}
            onRef={(el) => {
              nodeRefs.current['anna'] = el;
            }}
          />
        </div>

        {/* Level 2 */}
        <div className="flex justify-between w-full">
          {[teamData[1], teamData[2], teamData[3]].map((member) => (
            <div key={member.id} className="w-1/3 flex justify-center">
              <Node
                member={member}
                onRef={(el) => {
                  nodeRefs.current[member.id] = el;
                }}
              />
            </div>
          ))}
        </div>

        {/* Level 3 */}
        <div className="flex justify-between w-full">
          <div className="w-1/3" />
          <div className="w-1/3" />
          <div className="w-1/3 flex justify-center">
            <Node
              member={teamData[4]}
              onRef={(el) => {
                nodeRefs.current['daniel'] = el;
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Node({
  member,
  onRef,
}: {
  member: TeamMember;
  onRef: (el: HTMLDivElement | null) => void;
}) {
  if (member.isVisible === false) {
    return <div ref={onRef} className="w-64 h-24" />;
  }

  return (
    <motion.div
      ref={onRef}
      variants={cardVariants}
      className="w-64 bg-card rounded-xl p-6 shadow-sm border border-border flex flex-col items-center text-center"
    >
      <div className="w-16 h-16 rounded-full bg-muted mb-4 flex items-center justify-center overflow-hidden">
        <span className="text-muted-foreground font-bold text-xl">
          {member.name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </span>
      </div>
      <h3 className="font-semibold text-lg text-foreground">{member.name}</h3>
      <p className="text-muted-foreground text-sm">{member.role || '\u00A0'}</p>
    </motion.div>
  );
}
