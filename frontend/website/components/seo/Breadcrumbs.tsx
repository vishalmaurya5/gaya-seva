import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { buildBreadcrumbSchema } from '@/lib/seo/schema';
import { JsonLd } from './JsonLd';

export interface BreadcrumbItem {
  label: string;
  url: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const fullItems = [{ label: 'Home', url: '/' }, ...items];
  const schemaData = buildBreadcrumbSchema(
    fullItems.map((item) => ({ name: item.label, url: item.url }))
  );

  return (
    <>
      <JsonLd data={schemaData} />
      <nav aria-label="Breadcrumb" className="py-2.5 px-3 bg-amber-50/80 rounded-xl border border-amber-200/80 text-xs font-semibold text-slate-700 flex items-center gap-1.5 flex-wrap">
        {fullItems.map((item, index) => {
          const isLast = index === fullItems.length - 1;
          return (
            <React.Fragment key={item.url + index}>
              {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
              {index === 0 && <Home className="w-3.5 h-3.5 text-amber-700 shrink-0" />}
              
              {isLast ? (
                <span className="font-extrabold text-[#4A2E1A] truncate max-w-[200px] sm:max-w-none" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="hover:text-[#F58220] transition-colors truncate max-w-[150px] sm:max-w-none"
                >
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </>
  );
}
