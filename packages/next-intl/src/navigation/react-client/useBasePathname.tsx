'use client';

import {usePathname as useNextPathname} from 'next/navigation';
import {useMemo} from 'react';
import useLocale from '../../react-client/useLocale';
import {AllLocales, LocalePrefixConfigVerbose} from '../../shared/types';
import {
  getLocalePrefix,
  hasPathnamePrefixed,
  unprefixPathname
} from '../../shared/utils';

/**
 * Returns the pathname without a potential locale prefix.
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import {usePathname} from 'next-intl/client';
 *
 * // When the user is on `/en`, this will be `/`
 * const pathname = usePathname();
 * ```
 */
export default function useBasePathname<Locales extends AllLocales>(
  localePrefix: LocalePrefixConfigVerbose<Locales>
) {
  // The types aren't entirely correct here. Outside of Next.js
  // `useParams` can be called, but the return type is `null`.

  // Notes on `useNextPathname`:
  // - Types aren't entirely correct. Outside of Next.js the
  //   hook will return `null` (e.g. unit tests)
  // - A base path is stripped from the result
  // - Rewrites *are* taken into account (i.e. the pathname
  //   that the user sees in the browser is returned)
  const pathname = useNextPathname() as ReturnType<
    typeof useNextPathname
  > | null;

  const locale = useLocale();

  return useMemo(() => {
    if (!pathname) return pathname;

    // Note that `usePathname` returns the internal path, not
    // taking into account potential rewrites from the middleware
    const prefix = getLocalePrefix(locale, localePrefix);

    const isPathnamePrefixed = hasPathnamePrefixed(prefix, pathname);
    const unlocalizedPathname = isPathnamePrefixed
      ? unprefixPathname(pathname, prefix)
      : pathname;

    return unlocalizedPathname;
  }, [locale, localePrefix, pathname]);
}
