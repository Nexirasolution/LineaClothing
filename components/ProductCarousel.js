'use client';

import Link from 'next/link';
import ProductCard from './ProductCard';

// Design tokens — shared black / white / gold theme
const INK = '#000000';

// New Launches is a teaser, not the full catalog — cap it at 6 so it reads
// as a curated pick rather than a dumping ground of everything new.
const NEW_LAUNCH_LIMIT = 6;

// Tabs were removed: this section now shows New Launches only.
// Pass the latest products via `newLaunches` (newest first).
export default function ProductTabs({ newLaunches = [] }) {
  const products = newLaunches.slice(0, NEW_LAUNCH_LIMIT);

  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-14">
      {/* Section heading */}
      <div className="text-center mb-8">
        <h2
          className="text-2xl sm:text-3xl font-semibold tracking-tight"
          style={{ color: INK, fontFamily: 'Georgia, serif' }}
        >
          New Launches
        </h2>
      </div>

      {/* Product grid — extra row gap now that each card has buttons under it */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 mt-6">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        {/* Colors live in classes (not inline style) so the hover state can override them */}
        <Link
          href="/products?flag=newarrival"
          className="inline-flex items-center gap-2 text-[12px] font-normal tracking-[2px] uppercase px-8 py-3 rounded-full transition-colors bg-black text-[#C9A227] border border-[#C9A227] hover:bg-[#C9A227] hover:text-black"
        >
          Shop New Launches
        </Link>
      </div>
    </section>
  );
}