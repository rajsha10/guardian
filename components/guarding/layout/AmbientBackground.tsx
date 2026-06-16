'use client';

export default function AmbientBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-guardian-obsidian">
      {/* Subtle Mesh Grid lines */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Radial dot patterns for command center feel */}
      <div 
        className="absolute inset-0 opacity-[0.04]" 
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1.2px, transparent 1.2px)',
          backgroundSize: '20px 20px',
        }}
      />
    </div>
  );
}
