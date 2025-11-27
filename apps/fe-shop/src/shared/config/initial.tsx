'use client';

import { useEffect } from 'react';
import { OverlayScrollbars } from 'overlayscrollbars';

export function AppInitConfig() {
  useEffect(() => {
    OverlayScrollbars(document.body, {
      scrollbars: {
        autoHide: 'leave',
      },
    });
  }, []);

  return null; // Không render gì cả, chỉ để init
}
